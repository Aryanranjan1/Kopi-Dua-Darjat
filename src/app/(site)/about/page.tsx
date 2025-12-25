
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/firestore/getSiteContent';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import WhoAreWe from '@/components/about/WhoAreWe';
import Stats from '@/components/about/Stats';
import AboutMediaSections from '@/components/about/AboutMediaSections';
import LatestStories from '@/components/home/LatestStories';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import { getServerLanguage } from '@/lib/getServerLanguage';
import StickyGallery from '@/components/about/StickyGallery';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about the history and passion behind Kopi Dua Darjat.',
};

export const revalidate = 60; // Revalidate the data every 60 seconds

export default async function AboutPage() {
  const allContent = await getSiteContent();

  if (!allContent) {
    notFound();
  }
  
  const lang = getServerLanguage();
  const pageContent = allContent[lang];


  return (
    <>
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <Suspense fallback={<div className="h-[40vh] w-full bg-primary" />}>
        <WhoAreWe content={pageContent} />
      </Suspense>

      <Suspense fallback={<div className="h-[30vh] w-full bg-black" />}>
        <Stats content={pageContent} />
      </Suspense>

      <Suspense fallback={<div className="h-screen w-full bg-background flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <AboutMediaSections content={pageContent} />
      </Suspense>
      
      <Suspense fallback={<div className="h-screen w-full bg-white" />}>
        <StickyGallery />
      </Suspense>
    </div>
    <Suspense fallback={<div className="h-[80vh] w-full bg-black" />}>
      <LatestStories content={pageContent} />
    </Suspense>
    <NewsletterSignUp />
    </>
  );
}
