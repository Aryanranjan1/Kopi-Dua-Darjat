'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface SettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const settingsRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'settings', 'main') : null),
    [firestore]
  );
  const { data: settings, isLoading } = useDoc<SiteSettings>(settingsRef);

  // You might want to show a global loader while settings are loading for the first time
  if (isLoading && !settings) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
