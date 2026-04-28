'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Globe, MoreHorizontal, Download, Facebook, ChevronRight, ImagePlus, X, Check } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Message } from '@/lib/types';

interface AdPreviewProps {
  messages: Message[];
  activeAd: string | null;
  activeImageUrl: string | null;
  activeImagePrompt: string | null;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  isLoading: boolean;
  isRegeneratingImage?: boolean;
  activeMessageId: string | null;
  onUpdateAd: (content: string) => void;
  onUpdateImagePrompt: (prompt: string) => void;
  onRegenerateImage: (messageId: string, customPrompt?: string) => void;
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  selectedImage: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
}

export const AdPreview: React.FC<AdPreviewProps> = ({ 
  messages,
  activeAd, 
  activeImageUrl,
  activeImagePrompt,
  onCopy, 
  copiedId, 
  isLoading,
  isRegeneratingImage,
  activeMessageId,
  onUpdateAd,
  onUpdateImagePrompt,
  onRegenerateImage,
  input,
  setInput,
  onSend,
  selectedImage,
  onFileSelect,
  onClearImage
}) => {
  const { t } = useLanguage();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <section className="flex-1 bg-white md:bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Messages / Chat Flow */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar pb-40">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} ${msg.id === 'initial' ? 'items-center text-center py-10' : ''}`}
            >
              <div className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} ${msg.id === 'initial' ? 'flex-col items-center text-center' : ''} w-full`}>
                <motion.div 
                  whileHover={{ rotateY: 360, scale: 1.1 }}
                  animate={msg.id === 'initial' ? { 
                    y: [0, -10, 0],
                    boxShadow: ["0 0 0px rgba(79, 70, 229, 0)", "0 0 30px rgba(79, 70, 229, 0.4)", "0 0 0px rgba(79, 70, 229, 0)"]
                  } : {}}
                  transition={msg.id === 'initial' ? { 
                    y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                    boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    rotateY: { duration: 0.6 }
                  } : { rotateY: { duration: 0.6 } }}
                  className={`${msg.id === 'initial' ? 'w-20 h-20 md:w-24 md:h-24 text-2xl md:text-3xl italic' : 'w-8 h-8 md:w-10 md:h-10 text-[10px] md:text-xs'} rounded-2xl md:rounded-3xl shrink-0 flex items-center justify-center text-white font-black shadow-sm cursor-pointer ${msg.role === 'bot' ? 'bg-indigo-600' : 'bg-orange-500'}`}
                >
                  {msg.role === 'bot' ? 'FB' : <User size={16} />}
                </motion.div>
                <div className={`
                  ${msg.id === 'initial' ? 'max-w-md' : 'max-w-[85%]'} p-4 md:p-6 rounded-2xl md:rounded-3xl text-sm md:text-base leading-relaxed
                  ${msg.role === 'bot' 
                    ? (msg.id === 'initial' ? 'bg-transparent text-slate-800' : 'bg-slate-100 text-slate-700 rounded-tl-none') 
                    : 'bg-orange-500 text-white rounded-tr-none shadow-md shadow-orange-100'}
                `}>
                  <div className={`whitespace-pre-wrap ${msg.id === 'initial' ? 'text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2' : ''}`}>
                    {msg.id === 'initial' ? t.welcomeMessage : (msg.isAd ? '' : msg.content)}
                  </div>
                  
                  {/* Integrated Ad Preview Card */}
                  {msg.isAd && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="w-full max-w-lg mt-4 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200"
                    >
                      <div className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white text-[10px] font-bold">BRAND</div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 text-sm">{t.brandName}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            {t.sponsored} • <Globe size={11} />
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>

                      {/* The Ad Text Content (Presentation) */}
                      <div className="px-4 pb-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                      
                      <div className="aspect-video bg-slate-100 relative flex items-center justify-center overflow-hidden group/ad-card">
                        {msg.imageUrl ? (
                          <>
                            <img 
                              src={msg.imageUrl} 
                              alt="Ad Visual" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {msg.id === activeMessageId && (
                              <button 
                                onClick={() => onRegenerateImage(msg.id, msg.imagePrompt || undefined)}
                                disabled={isRegeneratingImage}
                                className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-xl hover:bg-white/40 text-white border border-white/30 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all shadow-xl opacity-0 group-hover/ad-card:opacity-100"
                              >
                                <Sparkles size={14} className={isRegeneratingImage ? 'animate-spin' : ''} />
                                {isRegeneratingImage ? 'Ģenerē...' : 'Cita bilde'}
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <motion.div 
                              animate={{ rotate: 360 }} 
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                              className="text-slate-300"
                            >
                              <Sparkles size={32} />
                            </motion.div>
                            <span className="text-xs text-slate-400 font-medium tracking-wide">Meklējam labāko bildi...</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex-1 pr-4 min-w-0">
                          <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">WWW.WEBSITE.COM</div>
                          <div className="font-bold text-slate-900 text-xs truncate">Check it out now!</div>
                        </div>
                        <button className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-lg font-bold text-[10px] text-slate-700 transition-colors whitespace-nowrap">
                          {t.learnMore}
                        </button>
                      </div>

                      <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                        <button 
                          onClick={() => onCopy(msg.content, msg.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 hover:border-indigo-500 transition-all text-slate-700 text-xs font-bold"
                        >
                          {copiedId === msg.id ? <Check size={14} className="text-green-500" /> : <Download size={14} className="text-indigo-600" />}
                          {copiedId === msg.id ? t.copied : t.download}
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 px-3 py-2 rounded-xl text-white text-xs font-bold hover:bg-indigo-700 transition-all">
                          <Facebook size={14} />
                          {t.share}
                        </button>
                      </div>
                    </motion.div>
                  )}
                  

                </div>
              </div>
              
                </motion.div>
          ))}

          {isLoading && (
            <div className="w-full flex flex-col items-center gap-6 py-8">
              <div className="flex items-center gap-2 mb-2">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="text-indigo-600"
                >
                  <Sparkles size={24} />
                </motion.div>
                <span className="text-slate-600 font-bold text-lg">{t.magicLoading}</span>
              </div>
              <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-slate-200">
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-1/3 animate-pulse" />
                    <div className="h-2 bg-slate-50 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-50 rounded w-full animate-pulse" />
                  <div className="h-4 bg-slate-50 rounded w-5/6 animate-pulse" />
                </div>
                <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl animate-pulse flex items-center justify-center">
                  <Globe size={40} className="text-slate-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Centered Input Bar */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4 md:px-6 z-10 transition-all">
        <div className="w-full max-w-3xl flex flex-col gap-2">
          {/* Selected Image Preview (User) */}
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="self-start ml-2 md:ml-4 relative group"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-xl p-1 bg-white">
                <img src={selectedImage} alt="Selection" className="w-full h-full object-cover rounded-xl" />
              </div>
              <button 
                onClick={onClearImage}
                className="absolute -top-2 -right-2 bg-slate-800 text-white p-1.5 rounded-full shadow-lg hover:bg-slate-900 transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}

          <div className="relative group">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={onFileSelect}
              accept="image/*"
              className="hidden"
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              title="Pievienot attēlu"
            >
              <ImagePlus size={22} />
            </button>

            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
              placeholder={selectedImage ? "Pievieno aprakstu vai spied sūtīt..." : t.inputPlaceholder} 
              className="w-full pl-14 pr-14 py-4 md:py-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm md:text-base group-hover:border-slate-300"
            />
            
            <button 
              onClick={onSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className={`
                absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transition-all
                ${isLoading || (!input.trim() && !selectedImage) 
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}
              `}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};
