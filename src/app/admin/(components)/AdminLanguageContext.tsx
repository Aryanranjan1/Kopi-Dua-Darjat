
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LangCode, DEFAULT_LANGUAGE } from '@/lib/types';

interface AdminLanguageContextType {
  language: LangCode;
  setLanguage: (language: LangCode) => void;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export const AdminLanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LangCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    // On mount, try to get the language from localStorage
    const storedLanguage = localStorage.getItem('adminLanguage') as LangCode;
    if (storedLanguage) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: LangCode) => {
    setLanguageState(lang);
    localStorage.setItem('adminLanguage', lang);
  };

  return (
    <AdminLanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </AdminLanguageContext.Provider>
  );
};

export const useAdminLanguage = () => {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error('useAdminLanguage must be used within an AdminLanguageProvider');
  }
  return context;
};
