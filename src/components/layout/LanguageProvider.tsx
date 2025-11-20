
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LangCode, DEFAULT_LANGUAGE } from '@/lib/types';

interface LanguageContextType {
  language: LangCode;
  setLanguage: (language: LangCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LangCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('siteLanguage') as LangCode;
    if (storedLanguage) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: LangCode) => {
    setLanguageState(lang);
    localStorage.setItem('siteLanguage', lang);
    // Optional: force a reload to ensure all server components re-render with new lang if needed
    // window.location.reload(); 
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
