'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'LV' | 'EN';

interface Translations {
  headerTitle: string;
  headerMagic: string;
  welcomeMessage: string;
  inputPlaceholder: string;
  marketStandards: string;
  magicLoading: string;
  previewTitle: string;
  previewDescription: string;
  previewButton: string;
  download: string;
  share: string;
  brandName: string;
  sponsored: string;
  learnMore: string;
  copyText: string;
  copied: string;
  profile: string;
  settings: string;
  changeLanguage: string;
  recent: string;
  logout: string;
  proPlan: string;
  newIdea: string;
  newChat: string;
}

const translations: Record<Language, Translations> = {
  LV: {
    headerTitle: 'AdStyle',
    headerMagic: 'Magic',
    welcomeMessage: 'Sākam! Apraksti savu produktu vai ieliec linku un radām reklāmu.',
    inputPlaceholder: 'Raksti šeit... (piem. "Piedāvā tam vairāk humora")',
    marketStandards: 'Latvijas tirgus standarti',
    magicLoading: 'Maģija top...',
    previewTitle: 'Gaidu Tavu ideju',
    previewDescription: 'Ievadi informāciju par savu produktu tērzēšanas logā, un es šeit sagatavošu stilīgu priekšskatījumu!',
    previewButton: 'Stila priekšskatījums',
    download: 'Lejupielādēt',
    share: 'Kopīgot',
    brandName: 'Tavs zīmols',
    sponsored: 'Sponsorēts',
    learnMore: 'Uzzini vairāk',
    copyText: 'Kopēt tekstu',
    copied: 'Nokopēts',
    profile: 'Profils',
    settings: 'Iestatījumi',
    changeLanguage: 'Mainīt valodu',
    recent: 'Nesenie',
    logout: 'Izlogoties',
    proPlan: 'Admin',
    newIdea: 'Jauna ideja',
    newChat: 'Jauns čats',
  },
  EN: {
    headerTitle: 'AdStyle',
    headerMagic: 'Magic',
    welcomeMessage: "Let's go! Describe your product or paste a link to start.",
    inputPlaceholder: 'Type here... (e.g. "Add more humor")',
    marketStandards: 'Market Standards',
    magicLoading: 'Generating magic...',
    previewTitle: 'Waiting for your idea',
    previewDescription: 'Enter info about your product in the chat, and I will prepare a stylish preview here!',
    previewButton: 'Style Preview',
    download: 'Download',
    share: 'Share',
    brandName: 'Your Brand',
    sponsored: 'Sponsored',
    learnMore: 'Learn more',
    copyText: 'Copy text',
    copied: 'Copied',
    profile: 'Profil',
    settings: 'Settings',
    changeLanguage: 'Change Language',
    recent: 'Recent',
    logout: 'Logout',
    proPlan: 'Admin',
    newIdea: 'New Idea',
    newChat: 'New Chat',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('LV');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
