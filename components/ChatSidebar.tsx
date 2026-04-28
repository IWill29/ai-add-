'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Copy, Check, ChevronRight, Sparkles, X, Settings, Languages, LogOut, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Message } from '@/lib/types';

import { useLanguage } from '@/lib/LanguageContext';

interface ChatSidebarProps {
  messages: Message[];
  chats: any[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isLoading: boolean;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isLoading,
  onCopy,
  copiedId,
  isOpen,
  onClose,
  onClear
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <section className={`
        fixed inset-y-0 left-0 z-50 w-[280px] md:relative md:z-auto
        bg-[#f9f9f8] border-r border-slate-200 flex flex-col shrink-0
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-3 flex items-center">
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X size={16} />
          </button>
          
          <button 
            onClick={onNewChat}
            className="ml-auto flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
            title={t.newChat}
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>

      <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-2">
          <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.recent}</h3>
        </div>
        
        <div className="space-y-1">
          {chats.filter(chat => (chat._count?.messages || 0) > 0).map((chat) => (
            <div key={chat.id} className="group relative">
              <button 
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center gap-2 ${
                  currentChatId === chat.id 
                    ? 'bg-white border-indigo-100 shadow-sm text-indigo-600' 
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-white hover:border-slate-100'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${currentChatId === chat.id ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                <span className="truncate flex-1 pr-5">
                  {chat.title}
                </span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 ${currentChatId === chat.id ? 'opacity-100' : ''}`}
                title="Dzēst čatu"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-slate-200 bg-white relative">
        <AnimatePresence>
          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => { setIsProfileOpen(false); setShowLanguages(false); }}
              />
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-40 divide-y divide-slate-100"
              >
                <div className="p-1.5">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                    <Settings size={16} className="text-slate-400" />
                    <span className="font-medium">{t.settings}</span>
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowLanguages(!showLanguages)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs rounded-xl transition-all duration-300 ${
                        showLanguages ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Languages size={16} className={showLanguages ? 'text-indigo-500' : 'text-slate-400'} />
                      <span className="font-medium flex-1 text-left">{t.changeLanguage}</span>
                      <ChevronRight size={12} className={`transition-transform duration-300 ${showLanguages ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showLanguages && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50/50 rounded-xl mt-1 mx-2"
                        >
                          <button 
                            onClick={() => { setLanguage('LV'); setIsProfileOpen(false); setShowLanguages(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${language === 'LV' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
                          >
                            <span>Latviešu</span>
                            {language === 'LV' && <Check size={14} />}
                          </button>
                          <button 
                            onClick={() => { setLanguage('EN'); setIsProfileOpen(false); setShowLanguages(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${language === 'EN' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
                          >
                            <span>English</span>
                            {language === 'EN' && <Check size={14} />}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="p-1.5">
                  <button 
                    onClick={onClear}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="font-bold">{t.logout}</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`w-full flex items-center gap-2 px-1.5 py-1.5 rounded-xl transition-all duration-300 ${
            isProfileOpen ? 'bg-slate-100' : 'hover:bg-slate-50'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <User size={18} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-bold text-slate-900 truncate">Admin</div>
            <div className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{t.proPlan}</div>
          </div>
          <ChevronUp size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
      </section>
    </>
  );
};
