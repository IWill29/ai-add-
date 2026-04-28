'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Copy, Check, ChevronRight, Sparkles, X, Settings, Languages, LogOut, ChevronUp } from 'lucide-react';
import { Message } from '@/lib/types';

import { useLanguage } from '@/lib/LanguageContext';

interface ChatSidebarProps {
  messages: Message[];
  isLoading: boolean;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  isLoading,
  onCopy,
  copiedId,
  isOpen,
  onClose
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
        <div className="p-4 border-b border-slate-100 flex items-center justify-end">
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.recent}</h3>
        </div>
        
        <div className="space-y-1">
          {messages.length > 0 && (
            <button className="w-full text-left px-3 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="truncate flex-1">
                {messages.find(m => m.role === 'user')?.content || t.newIdea}
              </span>
            </button>
          )}
          
          {/* Mock history items to show the look */}
          <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-200/50 rounded-xl transition-colors flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="truncate flex-1">Apavu veikala kampaņa</span>
          </button>
          <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-200/50 rounded-xl transition-colors flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="truncate flex-1">Vasaras izpārdošana</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 bg-white relative">
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
                className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-40 divide-y divide-slate-100"
              >
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors">
                    <Settings size={18} className="text-slate-400" />
                    <span className="font-medium">{t.settings}</span>
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowLanguages(!showLanguages)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all duration-300 ${
                        showLanguages ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Languages size={18} className={showLanguages ? 'text-indigo-500' : 'text-slate-400'} />
                      <span className="font-medium flex-1 text-left">{t.changeLanguage}</span>
                      <ChevronRight size={14} className={`transition-transform duration-300 ${showLanguages ? 'rotate-90' : ''}`} />
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

                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                    <LogOut size={18} />
                    <span className="font-bold">{t.logout}</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`w-full flex items-center gap-3 px-2 py-2 rounded-2xl transition-all duration-300 ${
            isProfileOpen ? 'bg-slate-100' : 'hover:bg-slate-50'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            AK
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-bold text-slate-900 truncate">Agnis Kulakovs</div>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{t.proPlan}</div>
          </div>
          <ChevronUp size={16} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
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
