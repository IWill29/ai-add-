'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Languages, Menu, User, Settings, LogOut, Check } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onClearHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onClearHistory }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

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
      </div>
    </header>
  );
};
