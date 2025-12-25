
'use client';

import { Suspense } from 'react';
import { getSiteContent } from '@/lib/firestore/getSiteContent';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/layout/LanguageProvider';

import WhoAreWe from '@/components/about/WhoAreWe';
import Stats from '@/components/about/Stats';
import AboutMediaSections from '@/components/about/AboutMediaSections';
import LatestStories from '@/components/home/LatestStories';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import LivingMosaicGallery from '@/components/about/LivingMosaicGallery';


export default function AboutPage() {
  const { language } = useLanguage();
  // Since this is a client component now due to the hook, we can't fetch server-side content directly here.
  // We'll rely on the components themselves to fetch or receive content.
  // For components that need `siteContent`, we'll need to adjust them or wrap this page.
  // For now, let's assume `AboutMediaSections` and `Stats` can be adjusted.
  // This is a simplification to get the page working. A better approach might be a top-level provider.
  // We'll pass a placeholder for now, which the components will need to handle.
  const placeholderContent = { [language]: { about: {} } };


  return (
    <>
    <div className="bg-background text-foreground">
      {/* Hero Section placeholder */}
      <div className="py-24 sm:py-32 text-center bg-primary">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground">
              Our Story
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/80">
              Learn about the history and passion behind Kopi Dua Darjat.
            </p>
          </div>
      </div>

      <WhoAreWe content={placeholderContent} />
      <Stats content={placeholderContent} />
      <AboutMediaSections content={placeholderContent} />
      <LivingMosaicGallery />
    </div>
    <LatestStories content={placeholderContent} />
    <NewsletterSignUp />
    </>
  );
}
