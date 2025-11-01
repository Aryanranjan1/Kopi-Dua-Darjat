'use client';

import { useState, useMemo } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { faqItems } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

// export const metadata: Metadata = {
//   title: 'FAQ',
//   description: 'Find answers to frequently asked questions about Kopi Dua Darjat.',
// };

const faqCategories = [
  {
    title: 'General FAQs',
    tag: 'General',
    description: 'Everything you need to know about our brand and how it works.',
  },
  {
    title: 'Product FAQs',
    tag: 'Product',
    description: 'Details about our delicious coffee and other menu items.',
  },
  {
    title: 'Franchise FAQs',
    tag: 'Franchise',
    description: 'Information for aspiring entrepreneurs who want to join our family.',
  },
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const heroImage = PlaceHolderImages.find((img) => img.id === 'faq-hero');

  const filteredFaqItems = useMemo(() => {
    if (!searchTerm) {
      return faqItems;
    }
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getItemsForCategory = (category: string) => {
    return filteredFaqItems.filter((item) => item.category === category);
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <AnimateOnScroll animationType="fadeIn">
        <section className="bg-black text-white pt-32 pb-24">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="font-semibold text-primary">Support</p>
                <h1 className="mt-2 text-4xl md:text-6xl font-headline font-bold">
                  Frequently Asked Questions
                </h1>
                <p className="mt-4 text-lg text-white/80">
                  Need help with something? Here are our most frequently asked
                  questions.
                </p>
                <div className="relative mt-8 max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <Input
                    type="search"
                    placeholder="Search questions..."
                    className="w-full rounded-full bg-white/10 border-white/20 text-white pl-12 placeholder:text-white/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden hidden lg:block">
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
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
                  <h2 className="text-3xl font-headline font-bold text-primary">
                    {category.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {category.description} Can't find an answer?{' '}
                    <Link href="/contact" className="text-accent hover:underline">
                      Chat to our team
                    </Link>
                    .
                  </p>
                </div>

                {/* Right Column: Accordion */}
                <div className="lg:col-span-2">
                  <Accordion type="single" collapsible defaultValue={items[0].id}>
                    {items.map((item) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="border-b-2 border-border"
                      >
                        <AccordionTrigger className="text-lg text-left font-semibold text-foreground hover:no-underline py-6">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground pb-6">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </AnimateOnScroll>
            );
          })}
           {filteredFaqItems.length === 0 && searchTerm && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold">No results found</h3>
                <p className="text-muted-foreground mt-2">
                  We couldn't find any answers for "{searchTerm}". Try a different search.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
