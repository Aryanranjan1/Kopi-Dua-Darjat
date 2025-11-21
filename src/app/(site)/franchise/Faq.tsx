
'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { FaqItem } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { getLocalized } from '@/lib/utils';

export default function Faq() {
  const firestore = useFirestore();
  const { language } = useLanguage();

  const faqQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'faq'), where('category', '==', 'Franchise')) : null,
    [firestore]
  );
  const { data: faqItems, isLoading } = useCollection<FaqItem>(faqQuery);

  // Memoize the localized data to prevent re-computation on every render
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
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Have questions? We have answers. Here are some of the most common inquiries from potential franchisees.
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
