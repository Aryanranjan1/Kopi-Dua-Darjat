
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LangCode, DEFAULT_LANGUAGE } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface LanguageContextType {
  language: LangCode;
  setLanguage: (language: LangCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LangCode>(DEFAULT_LANGUAGE);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('siteLanguage') as LangCode;
    if (storedLanguage && ['en', 'ms'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
      document.cookie = `lang=${storedLanguage}; path=/; max-age=31536000`;
    } else {
      document.cookie = `lang=${DEFAULT_LANGUAGE}; path=/; max-age=31536000`;
    }
  }, []);

  const setLanguage = (lang: LangCode) => {
    setLanguageState(lang);
    localStorage.setItem('siteLanguage', lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000`; // Set cookie for server
    
    // Use router.refresh() for App Router to re-fetch server components with new cookie
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
