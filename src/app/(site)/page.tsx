
import { Suspense } from 'react';
import { getSiteContent } from '@/lib/firestore/getSiteContent';
import { getServerLanguage } from '@/lib/getServerLanguage';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import Hero from '@/components/home/Hero';
import FeaturedDrinks, { FeaturedDrinksSkeleton } from '@/components/home/FeaturedDrinks';
import ActivePromotions from '@/components/home/ActivePromotions';
import MenuShowcase from '@/components/home/MenuShowcase';
import BrandStory from '@/components/home/BrandStory';
import OutletFinder from '@/components/home/OutletFinder';
import Community from '@/components/home/Community';
import LatestStories from '@/components/home/LatestStories';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import InstaExploreGrid from '@/components/home/InstaExploreGrid';

export const revalidate = 60; // Revalidate the data every 60 seconds

export default async function Home() {
  const lang = getServerLanguage();
  const allContent = await getSiteContent();

  if (!allContent) {
    notFound();
  }

  const homeContent = allContent[lang]?.home;
  if (!homeContent) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <Suspense fallback={<div className="h-screen w-full bg-primary flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-foreground" /></div>}>
        <Hero content={homeContent.hero} />
      </Suspense>
      
      <Suspense fallback={<FeaturedDrinksSkeleton />}>
        <FeaturedDrinks />
      </Suspense>

      <Suspense fallback={<div className="h-screen w-full bg-black" />}>
        <ActivePromotions content={homeContent.activePromotions} />
      </Suspense>

      <Suspense fallback={<div className="h-screen w-full bg-white" />}>
        <OutletFinder />
      </Suspense>

      <Suspense fallback={<div className="h-screen w-full bg-black" />}>
        <MenuShowcase />
      </Suspense>

      <Suspense fallback={<div className="h-screen w-full bg-background" />}>
        <BrandStory content={homeContent.brandStory} />
      </Suspense>
      
      <InstaExploreGrid />

      <Suspense fallback={<div className="h-screen w-full bg-white" />}>
        <Community content={homeContent.community} />
      </Suspense>

      <Suspense fallback={<div className="h-screen w-full bg-black" />}>
        <LatestStories content={homeContent.latestStories} />
      </Suspense>

      <NewsletterSignUp />
    </div>
  );
}
