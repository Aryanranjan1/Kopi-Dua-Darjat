
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/firestore/getSiteContent';
import { getServerLanguage } from '@/lib/getServerLanguage';
import { notFound } from 'next/navigation';

import WhoAreWe from '@/components/about/WhoAreWe';
import Stats from '@/components/about/Stats';
import { Loader2 } from 'lucide-react';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import StickyGallery from '@/components/about/StickyGallery';
import AboutMediaSections from '@/components/about/AboutMediaSections';
import LatestStories from '@/components/home/LatestStories';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';


export const revalidate = 60; // Revalidate the data every 60 seconds

export default async function AboutPage() {
  const lang = getServerLanguage();
  const allContent = await getSiteContent();

  if (!allContent) {
    notFound();
  }

  const content = allContent[lang];
  const aboutContent = content.about;
  const homeContent = content.home;

  if (!aboutContent || !homeContent) {
    notFound();
  }

  return (
    <>
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <AnimateOnScroll animationType="fadeIn">
        <section className="py-24 sm:py-32 text-center bg-primary">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground">
              {aboutContent.hero.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/80">
              {aboutContent.hero.subtitle}
            </p>
          </div>
        </section>
      </AnimateOnScroll>

      <WhoAreWe content={aboutContent.whoAreWe} />
      <Stats content={aboutContent.stats} />

      <Suspense fallback={<div className="h-screen w-full bg-background flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <AboutMediaSections content={aboutContent} />
      </Suspense>
      
      <StickyGallery />
    </div>
    <LatestStories content={homeContent.latestStories} />
    <NewsletterSignUp />
    </>
  );
}
