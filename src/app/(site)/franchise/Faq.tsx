
'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import type { FaqItem } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../layout/LanguageProvider';
import { getLocalized } from '@/lib/utils';
import { siteContentData } from '@/lib/site-content';
import { siteContentDataMs } from '@/lib/site-content-ms';

export default function Faq() {
  const firestore = useFirestore();
  const { language } = useLanguage();
  const content = language === 'ms' ? siteContentDataMs.franchise.faq : siteContentData.franchise.faq;

  // 1. Create a memoized and stable Firestore query
  const faqQuery = useMemoFirebase(
    () => firestore 
      ? query(
          collection(firestore, 'faq'), 
          where('category', '==', 'Franchise'),
          limit(4)
        ) 
      : null,
    [firestore]
  );

  // 2. Fetch the data using the query
  const { data: faqItems, isLoading } = useCollection<FaqItem>(faqQuery);

  // 3. Create a memoized, localized version of the data *before* rendering
  const localizedFaqItems = useMemo(() => {
    if (!faqItems) return [];
    return faqItems.map(item => {
      const localized = getLocalized(item, language);
      return {
        id: item.id,
        question: localized.question,
        answer: localized.answer,
      };
    });
  }, [faqItems, language]);

  return (
    <section className="py-24 sm:py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline text-primary">
            {content.title}
          </h2>
          <p className="mt-4 text-lg text-white/70">
            {content.subtitle}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2} className="max-w-4xl mx-auto mt-16">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {localizedFaqItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="bg-zinc-900 border-zinc-800 rounded-2xl px-6 border-none shadow-sm">
                    <AccordionTrigger className="text-lg font-headline text-left hover:no-underline text-white">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  );
}
