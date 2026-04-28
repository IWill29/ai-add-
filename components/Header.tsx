'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Languages, Menu } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onClearHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onClearHistory }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shadow-sm shrink-0 z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ rotateY: -180, scale: 0.5, opacity: 0 }}
            animate={{ 
              rotateY: 0, 
              scale: 1, 
              opacity: 1,
              boxShadow: [
                "0px 0px 0px rgba(79, 70, 229, 0)",
                "0px 0px 20px rgba(79, 70, 229, 0.4)",
                "0px 0px 0px rgba(79, 70, 229, 0)"
              ]
            }}
            transition={{ 
              rotateY: { type: "spring", stiffness: 100, damping: 10 },
              scale: { duration: 0.5 },
              boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.1, rotateY: 180 }}
            className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg italic select-none shrink-0"
          >
            FB
          </motion.div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
            {t.headerTitle} <span className="text-indigo-600">{t.headerMagic}</span>
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {onClearHistory && (
          <button 
            onClick={onClearHistory}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title={language === 'LV' ? 'Notīrīt vēsturi' : 'Clear history'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        )}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
          >
            <Languages size={16} className="text-indigo-600" />
            <span>{language === 'LV' ? 'Latviešu' : 'English'}</span>
            <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              <button 
                onClick={() => { setLanguage('LV'); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-indigo-50 transition-colors ${language === 'LV' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-600'}`}
              >
                Latviešu
              </button>
              <button 
                onClick={() => { setLanguage('EN'); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-indigo-50 transition-colors ${language === 'EN' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-600'}`}
              >
                English
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
