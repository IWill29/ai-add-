'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Copy, Check, ChevronRight, Sparkles, X } from 'lucide-react';
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
  const { t } = useLanguage();

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
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <button className="flex-1 flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600" />
              <span>Jauna reklāma</span>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </button>
          <button 
            onClick={onClose}
            className="ml-2 p-2 text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nesenie</h3>
        </div>
        
        <div className="space-y-1">
          {messages.length > 0 && (
            <button className="w-full text-left px-3 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="truncate flex-1">
                {messages.find(m => m.role === 'user')?.content || 'Jauna ideja'}
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

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-700 truncate">Agnis Kulakovs</div>
            <div className="text-[10px] text-slate-400 truncate">Pro plāns</div>
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
