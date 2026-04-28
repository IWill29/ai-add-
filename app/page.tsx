'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { ChatSidebar } from '@/components/ChatSidebar';
import { AdPreview } from '@/components/AdPreview';
import { useAdGenerator } from '@/hooks/use-ad-generator';

export default function AdStyleMagic() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const {
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
  } = useAdGenerator();

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onClearHistory={clearHistory} />
      
      <main className="flex-1 flex overflow-hidden relative">
        <ChatSidebar 
          messages={messages}
          chats={chats}
          currentChatId={currentChatId}
          onNewChat={createNewChat}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          isLoading={isLoading}
          onCopy={copyToClipboard}
          copiedId={copiedId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onClear={clearHistory}
        />
        
        <AdPreview 
          messages={messages}
          activeAd={activeAd}
          activeImageUrl={activeImageUrl}
          activeImagePrompt={activeImagePrompt}
          activeMessageId={activeMessageId}
          onUpdateAd={updateActiveAd}
          onUpdateImagePrompt={updateActiveImagePrompt}
          onRegenerateImage={regenerateImage}
          onCopy={copyToClipboard}
          copiedId={copiedId}
          isLoading={isLoading}
          isRegeneratingImage={isRegeneratingImage}
          input={input}
          setInput={setInput}
          onSend={handleSend}
          selectedImage={selectedImage}
          onFileSelect={handleFileSelect}
          onClearImage={clearSelectedImage}
        />
      </main>
    </div>
  );
}
