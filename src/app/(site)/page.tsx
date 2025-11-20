

import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import { Skeleton } from '@/components/ui/skeleton';
import InstaExploreGrid from '@/components/home/InstaExploreGrid';
import FeaturedDrinks from '@/components/home/FeaturedDrinks';

const ActivePromotions = dynamic(() => import('@/components/home/ActivePromotions'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
});
const MenuShowcase = dynamic(() => import('@/components/home/MenuShowcase'), {
  loading: () => <Skeleton className="h-[70vh] w-full bg-black" />,
});
const BrandStory = dynamic(() => import('@/components/home/BrandStory'), {
    loading: () => <Skeleton className="h-[60vh] w-full" />,
});
const OutletFinder = dynamic(() => import('@/components/home/OutletFinder'), {
  loading: () => (
    <div className="py-24 sm:py-32">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-12 w-2/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="space-y-4 pt-4">
                  <Skeleton className="h-24 w-full rounded-3xl" />
                  <Skeleton className="h-24 w-full rounded-3xl" />
                  <Skeleton className="h-24 w-full rounded-3xl" />
                </div>
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-full min-h-[600px] w-full rounded-3xl" />
            </div>
        </div>
      </div>
    </div>
  ),
});
const Community = dynamic(() => import('@/components/home/Community'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
});
const LatestStories = dynamic(() => import('@/components/home/LatestStories'), {
  loading: () => (
     <div className="py-24 sm:py-40 bg-black">
        <div className="container mx-auto px-6 sm:px-12">
          <Skeleton className="h-12 w-1/3 mb-12 bg-zinc-800" />
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl bg-zinc-800" />
              <Skeleton className="h-6 w-1/4 bg-zinc-800" />
              <Skeleton className="h-24 w-full bg-zinc-800" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full rounded-2xl bg-zinc-800" />
              <Skeleton className="h-32 w-full rounded-2xl bg-zinc-800" />
              <Skeleton className="h-32 w-full rounded-2xl bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
  ),
});
const NewsletterSignUp = dynamic(() => import('@/components/home/NewsletterSignUp'), {
  loading: () => <Skeleton className="h-[50vh] w-full" />,
});


export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedDrinks />
      <ActivePromotions />
      <OutletFinder />
      <MenuShowcase />
      <BrandStory />
      <InstaExploreGrid />
      <Community />
      <LatestStories />
      <NewsletterSignUp />
    </div>
  );
}
