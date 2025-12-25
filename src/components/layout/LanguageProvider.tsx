'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LangCode, DEFAULT_LANGUAGE } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface LanguageContextType {
  language: LangCode;
  setLanguage: (language: LangCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LangCode>(DEFAULT_LANGUAGE);
  const router = useRouter();

  useEffect(() => {
    // On mount, try to get the language from the cookie to set the initial UI state
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('lang='))
      ?.split('=')[1];
      
    if (cookieValue === 'en' || cookieValue === 'ms') {
      setLanguageState(cookieValue);
    }
  }, []);

  const setLanguage = (lang: LangCode) => {
    setLanguageState(lang);
    // Set a cookie that the server can read
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`; // Expires in 1 year
    
    // Refresh the page to force a server-side re-render with the new cookie
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
