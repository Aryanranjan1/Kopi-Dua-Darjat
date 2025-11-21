
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { FaqItem } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { getLocalized } from '@/lib/utils';

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();
  const { language } = useLanguage();
  const faqQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'faq')) : null, [firestore]);
  const { data: faqItems, isLoading: isLoadingFaqs } = useCollection<FaqItem>(faqQuery);

  // Temporary placeholder image
  const heroImage = {
    imageUrl: "https://images.unsplash.com/photo-1626097116802-708db5be6b00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1175",
    description: "A close up of a cup of coffee on a table.",
    imageHint: "cup of coffee"
  };
  const isLoadingImage = false;

  const faqCategories = useMemo(() => [
    {
      title: language === 'ms' ? 'Soalan Lazim Umum' : 'General FAQs',
      tag: 'General',
      description: language === 'ms' ? 'Semua yang anda perlu tahu tentang jenama kami dan cara ia berfungsi.' : 'Everything you need to know about our brand and how it works.',
    },
    {
      title: language === 'ms' ? 'Soalan Lazim Produk' : 'Product FAQs',
      tag: 'Product',
      description: language === 'ms' ? 'Butiran tentang kopi lazat kami dan item menu lain.' : 'Details about our delicious coffee and other menu items.',
    },
    {
      title: language === 'ms' ? 'Soalan Lazim Francais' : 'Franchise FAQs',
      tag: 'Franchise',
      description: language === 'ms' ? 'Maklumat untuk bakal usahawan yang ingin menyertai keluarga kami.' : 'Information for aspiring entrepreneurs who want to join our family.',
    },
  ], [language]);

  const filteredFaqItems = useMemo(() => {
    if (!faqItems) return [];
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    return faqItems.filter(
      (item) => {
        const localized = getLocalized(item, language);
        return (
            localized.question?.toLowerCase().includes(lowercasedSearchTerm) ||
            localized.answer?.toLowerCase().includes(lowercasedSearchTerm)
        );
      }
    );
  }, [searchTerm, faqItems, language]);

  const getItemsForCategory = (category: string) => {
    return filteredFaqItems.filter((item) => item.category === category);
  };

  const isLoading = isLoadingFaqs || isLoadingImage;

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <AnimateOnScroll animationType="fadeIn">
        <section className="bg-black text-white pt-32 pb-24">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="font-semibold text-primary">Sokongan</p>
                <h1 className="mt-2 text-4xl md:text-6xl font-headline font-bold">
                  Soalan Lazim
                </h1>
                <p className="mt-4 text-lg text-white/80">
                  Perlukan bantuan? Berikut adalah soalan yang paling kerap ditanya.
                </p>
                <div className="relative mt-8 max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <Input
                    type="search"
                    placeholder="Cari soalan..."
                    className="w-full rounded-full bg-white/10 border-white/20 text-white pl-12 placeholder:text-white/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden hidden lg:block">
                {isLoadingImage ? <Skeleton className="w-full h-full" /> : heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* FAQ Content Section */}
      <div className="py-24 sm:py-32">
        <div className="container mx-auto px-6">
          {isLoadingFaqs ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
          ) : (
            <>
              {faqCategories.map((category, catIndex) => {
                const items = getItemsForCategory(category.tag);
                if (items.length === 0) return null;
                return (
                  <AnimateOnScroll
                    key={category.tag}
                    animationType="fadeIn"
                    delay={catIndex * 0.1}
                    className="grid lg:grid-cols-3 gap-8 lg:gap-16 mb-24 last:mb-0"
                  >
                    {/* Left Column: Category Title */}
                    <div className="lg:col-span-1">
                      <h2 className="text-3xl font-headline font-bold text-foreground">
                        {category.title}
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        {category.description} {language === 'ms' ? 'Tidak jumpa jawapan?' : "Can't find an answer?"}{' '}
                        <Link href="/contact" className="text-accent hover:underline">
                          {language === 'ms' ? 'Berbual dengan pasukan kami' : 'Chat to our team'}
                        </Link>
                        .
                      </p>
                    </div>

                    {/* Right Column: Accordion */}
                    <div className="lg:col-span-2">
                      <Accordion type="single" collapsible defaultValue={items[0]?.id}>
                        {items.map((item) => {
                          const localized = getLocalized(item, language);
                          return (
                            <AccordionItem
                              key={item.id}
                              value={item.id}
                              className="border-b-2 border-border"
                            >
                              <AccordionTrigger className="text-lg text-left font-semibold text-foreground hover:no-underline py-6">
                                {localized.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-base text-muted-foreground pb-6">
                                {localized.answer}
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  </AnimateOnScroll>
                );
              })}
              {filteredFaqItems.length === 0 && searchTerm && (
                  <div className="text-center py-16">
                    <h3 className="text-2xl font-bold">Tiada hasil ditemui</h3>
                    <p className="text-muted-foreground mt-2">
                      Kami tidak dapat mencari sebarang jawapan untuk "{searchTerm}". Cuba carian lain.
                    </p>
                  </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
