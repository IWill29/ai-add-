'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/lib/types';
import { generateFacebookAd, generateImage } from '@/lib/AiServices';
import { useLanguage } from '@/lib/LanguageContext';

export const useAdGenerator = () => {
  const { language, t } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([{
    id: 'initial',
    role: 'bot',
    content: '' 
  }]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAd, setActiveAd] = useState<string | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [activeImagePrompt, setActiveImagePrompt] = useState<string | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);

  // Initial message if nothing in storage
  useEffect(() => {
    const saved = localStorage.getItem('ad_gen_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Use timeout to move state updates out of the synchronous effect execution
        // to avoid "cascading renders" linter error and satisfy Next.js hydration
        setTimeout(() => {
          setMessages(parsed);
          // Find last bot message to set as active
          const lastBot = [...parsed].reverse().find((m: any) => m.role === 'bot' && m.isAd);
          if (lastBot) {
            setActiveAd(lastBot.content);
            setActiveImageUrl(lastBot.imageUrl || null);
            setActiveImagePrompt(lastBot.imagePrompt || null);
            setActiveMessageId(lastBot.id);
          }
        }, 0);
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
  }, []);

  // Save messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ad_gen_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const clearHistory = () => {
    localStorage.removeItem('ad_gen_messages');
    setMessages([{
      id: 'initial',
      role: 'bot',
      content: '' 
    }]);
    setActiveAd(null);
    setActiveImageUrl(null);
    setActiveImagePrompt(null);
    setActiveMessageId(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => setSelectedImage(null);

  const updateActiveAd = (newContent: string) => {
    setActiveAd(newContent);
    if (activeMessageId) {
      setMessages(prev => prev.map(msg => 
        msg.id === activeMessageId ? { ...msg, content: newContent } : msg
      ));
    }
  };

  const updateActiveImagePrompt = (newPrompt: string) => {
    setActiveImagePrompt(newPrompt);
    if (activeMessageId) {
      setMessages(prev => prev.map(msg => 
        msg.id === activeMessageId ? { ...msg, imagePrompt: newPrompt } : msg
      ));
    }
  };

  const regenerateImage = async (messageId: string, customPrompt?: string) => {
    const msg = messages.find(m => m.id === messageId);
    if ((!msg?.imagePrompt && !customPrompt) || isRegeneratingImage) return;

    const promptToUse = customPrompt || msg?.imagePrompt || '';

    setIsRegeneratingImage(true);
    try {
      const newImageUrl = await generateImage(promptToUse);
      if (newImageUrl) {
        setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, imageUrl: newImageUrl, imagePrompt: promptToUse } : m
        ));
        if (activeMessageId === messageId) {
          setActiveImageUrl(newImageUrl);
          setActiveImagePrompt(promptToUse);
        }
      }
    } catch (error) {
      console.error('Error regenerating image:', error);
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      attachmentUrl: selectedImage || undefined
    };

    const currentImage = selectedImage;
    const currentInput = input;
    const history = messages.filter(m => m.id !== 'initial').slice(-10); // Last 10 messages for context
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let context = '';
      const urlMatch = currentInput.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        const url = urlMatch[0];
        try {
          const scrapeRes = await fetch('/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          });
          if (scrapeRes.ok) {
            const data = await scrapeRes.json();
            context = `Product Title: ${data.title}\nDescription: ${data.description}\nWebsite Content Snippet: ${data.text}`;
          }
        } catch (e) {
          console.error('Scrape failed', e);
        }
      }

      const { adContent, imagePrompt } = await generateFacebookAd(currentInput, language, context, currentImage || undefined, history);
      
      const botMessageId = (Date.now() + 1).toString();
      const botMessage: Message = {
        id: botMessageId,
        role: 'bot',
        content: adContent || 'Atvainojiet, kaut kas nogāja greizi.',
        isAd: true,
        imagePrompt: imagePrompt
      };

      setMessages(prev => [...prev, botMessage]);
      setActiveAd(botMessage.content);
      setActiveImagePrompt(botMessage.imagePrompt || null);
      setActiveMessageId(botMessageId);
      setIsLoading(false);

      if (imagePrompt) {
        const imageUrl = await generateImage(imagePrompt);
        if (imageUrl) {
          setActiveImageUrl(imageUrl);
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, imageUrl } : msg
          ));
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'Notika kļūda saziņā ar AI. Pārbaudi savu interneta pieslēgumu vai mēģini vēlāk.'
      }]);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    isRegeneratingImage,
    activeMessageId,
    copiedId,
    activeAd,
    activeImageUrl,
    activeImagePrompt,
    selectedImage,
    handleFileSelect,
    clearSelectedImage,
    handleSend,
    updateActiveAd,
    updateActiveImagePrompt,
    regenerateImage,
    clearHistory,
    copyToClipboard
  };
};
