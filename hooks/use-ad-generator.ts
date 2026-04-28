'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/lib/types';
import { generateFacebookAd, generateImage } from '@/lib/AiServices';
import { useLanguage } from '@/lib/LanguageContext';

export const useAdGenerator = () => {
  const { language, t } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAd, setActiveAd] = useState<string | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [activeImagePrompt, setActiveImagePrompt] = useState<string | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);

  const createNewChat = useCallback(async () => {
    // If current chat is already empty, don't create another one
    if (messages.length === 0 && currentChatId) return;

    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t.newChat })
      });
      if (res.ok) {
        const newChat = await res.json();
        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  }, [messages.length, currentChatId, t.newChat]);

  // Fetch all chats initially
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/chats');
        if (res.ok) {
          const data = await res.json();
          setChats(data);
          if (data.length > 0 && !currentChatId) {
            setCurrentChatId(data[0].id);
          } else if (data.length === 0) {
            // Create first chat if none exists
            // We use a simplified fetch here to avoid dependency issues in this one-time effect
            const initRes = await fetch('/api/chats', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: 'New Chat' })
            });
            if (initRes.ok) {
              const newChat = await initRes.json();
              setChats([newChat]);
              setCurrentChatId(newChat.id);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch messages when currentChatId changes
  useEffect(() => {
    if (!currentChatId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?chatId=${currentChatId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          // Find last bot message to set as active
          const lastBot = [...data].reverse().find((m: any) => m.role === 'bot' && m.isAd);
          if (lastBot) {
            setActiveAd(lastBot.content);
            setActiveImageUrl(lastBot.imageUrl || null);
            setActiveImagePrompt(lastBot.imagePrompt || null);
            setActiveMessageId(lastBot.id);
          } else {
            setActiveAd(null);
            setActiveImageUrl(null);
            setActiveImagePrompt(null);
            setActiveMessageId(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    
    fetchMessages();
  }, [currentChatId]);

  const deleteChat = async (id: string) => {
    try {
      const res = await fetch(`/api/chats/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setChats(prev => prev.filter(c => c.id !== id));
        if (currentChatId === id) {
          const remainingChats = chats.filter(c => c.id !== id);
          if (remainingChats.length > 0) {
            setCurrentChatId(remainingChats[0].id);
          } else {
            createNewChat();
          }
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const selectChat = (id: string) => {
    setCurrentChatId(id);
  };

  const clearHistory = async () => {
    if (!currentChatId) return;
    try {
      // In our multi-chat system, we might want to delete the whole chat or just clear messages
      // Let's assume clear history means clearing messages of CURRENT chat
      await fetch(`/api/messages/clear?chatId=${currentChatId}`, { method: 'DELETE' });
      setMessages([]);
      setActiveAd(null);
      setActiveImageUrl(null);
      setActiveImagePrompt(null);
      setActiveMessageId(null);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
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
      fetch(`/api/messages/${activeMessageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      }).catch(err => console.error('Failed to update ad in DB:', err));
    }
  };

  const updateActiveImagePrompt = (newPrompt: string) => {
    setActiveImagePrompt(newPrompt);
    if (activeMessageId) {
      setMessages(prev => prev.map(msg => 
        msg.id === activeMessageId ? { ...msg, imagePrompt: newPrompt } : msg
      ));
      fetch(`/api/messages/${activeMessageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePrompt: newPrompt })
      }).catch(err => console.error('Failed to update prompt in DB:', err));
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

        fetch(`/api/messages/${messageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: newImageUrl, imagePrompt: promptToUse })
        }).catch(err => console.error('Failed to update regenerated image in DB:', err));

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
    
    // Create a local temp ID to track the user message
    const tempUserMsgId = 'temp-' + Date.now();
    const userMsgData = {
      role: 'user' as const,
      content: currentInput,
      attachmentUrl: currentImage || undefined
    };

    setMessages(prev => [...prev, { ...userMsgData, id: tempUserMsgId } as Message]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Save user message to DB
      const userRes = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userMsgData, chatId: currentChatId })
      });
      
      const savedUserMessage = await userRes.json();
      
      // Replace temp user message with saved one
      setMessages(prev => prev.map(m => m.id === tempUserMsgId ? savedUserMessage : m));

      // If it's the first message, update chat title
      if (messages.length === 0 && currentChatId) {
        const title = currentInput.trim().slice(0, 40) + (currentInput.trim().length > 40 ? '...' : '') || t.newChat;
        setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, title, _count: { messages: 1 } } : c));
        fetch(`/api/chats/${currentChatId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        }).catch(err => console.error('Failed to update chat title:', err));
      }

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
      
      const botMsgData = {
        role: 'bot',
        content: adContent || 'Atvainojiet, kaut kas nogāja greizi.',
        isAd: true,
        imagePrompt: imagePrompt
      };

      const botRes = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...botMsgData, chatId: currentChatId })
      });
      
      const savedBotMessage = await botRes.json();

      setMessages(prev => {
        // Remove the temporary user message and add real one? 
        // Actually for simplicity we'll just append.
        return [...prev, savedBotMessage];
      });
      
      setActiveAd(savedBotMessage.content);
      setActiveImagePrompt(savedBotMessage.imagePrompt || null);
      setActiveMessageId(savedBotMessage.id);
      setIsLoading(false);

      if (imagePrompt) {
        const imageUrl = await generateImage(imagePrompt);
        if (imageUrl) {
          setActiveImageUrl(imageUrl);
          
          // Update DB with image URL
          fetch(`/api/messages/${savedBotMessage.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl })
          }).catch(err => console.error('Failed to update image URL in DB:', err));

          setMessages(prev => prev.map(msg => 
            msg.id === savedBotMessage.id ? { ...msg, imageUrl } : msg
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
    chats,
    currentChatId,
    createNewChat,
    selectChat,
    deleteChat,
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
