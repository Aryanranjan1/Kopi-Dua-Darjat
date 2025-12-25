
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/firestore/getSiteContent';
import { getServerLanguage } from '@/lib/getServerLanguage';
import { notFound } from 'next/navigation';

import WhoAreWe from '@/components/about/WhoAreWe';
import Stats from '@/components/about/Stats';
import { Check, Loader2 } from 'lucide-react';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import StickyGallery from '@/components/about/StickyGallery';
import AboutMediaSections from '@/components/about/AboutMediaSections';
import LatestStories from '@/components/home/LatestStories';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';


export const revalidate = 60; // Revalidate the data every 60 seconds

export default async function AboutPage() {
  const lang = getServerLanguage();
  const allContent = await getSiteContent();

  if (!allContent || !allContent[lang]) {
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

      {/* Vision & Mission Section */}
      <AnimateOnScroll animationType="fadeIn">
        <section className="bg-background text-foreground">
          <div className="container mx-auto px-0">
              <div className="grid lg:grid-cols-2">
                  <div className="bg-primary text-primary-foreground p-12 lg:p-24 flex flex-col justify-center text-center lg:text-left">
                      <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">{aboutContent.visionMission.visionTitle}</h2>
                      <p className="mt-4 text-xl md:text-2xl font-serif text-foreground/80 max-w-md mx-auto lg:mx-0">
                          {aboutContent.visionMission.visionText}
                      </p>
                  </div>
                  <div className="bg-background text-foreground p-12 lg:p-24">
                      <h3 className="text-3xl font-headline font-bold text-accent mb-6">{aboutContent.visionMission.missionTitle}</h3>
                      <ul className="space-y-4">
                          {aboutContent.visionMission.missionItems.map((item: string, index: number) => (
                            <li key={index} className="flex items-start">
                                <Check className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
        </section>
      </AnimateOnScroll>
      
      <StickyGallery />
    </div>
    <LatestStories content={homeContent.latestStories} />
    <NewsletterSignUp />
    </>
  );
}
