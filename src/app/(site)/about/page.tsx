
import { Suspense } from 'react';
import { getSiteContent } from '@/lib/firestore/getSiteContent';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getServerLanguage } from '@/lib/getServerLanguage';
import WhoAreWe from '@/components/about/WhoAreWe';
import Stats from '@/components/about/Stats';
import AboutMediaSections from '@/components/about/AboutMediaSections';
import LatestStories from '@/components/home/LatestStories';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import LivingMosaicGallery from '@/components/about/LivingMosaicGallery';

export default async function AboutPage() {
  const lang = getServerLanguage();
  const allContent = await getSiteContent();

  if (!allContent) {
    notFound();
  }

  const content = allContent[lang];
  const homeContent = content?.home || {};

  return (
    <>
      <div className="bg-background text-foreground">
        <div className="py-24 sm:py-32 text-center bg-primary">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground">
              {content.about.hero.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/80">
              {content.about.hero.subtitle}
            </p>
          </div>
        </div>

        <WhoAreWe content={content} />
        <Stats content={content} />
        <AboutMediaSections content={content} />
        <LivingMosaicGallery />
      </div>
      <LatestStories content={{[lang]: homeContent}} />
      <NewsletterSignUp />
    </>
  );
}
