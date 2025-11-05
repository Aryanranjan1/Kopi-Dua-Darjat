

import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import { Skeleton } from '@/components/ui/skeleton';
import InstaExploreGrid from '@/components/home/InstaExploreGrid';
import FeaturedDrinks from '@/components/home/FeaturedDrinks';

const ActivePromotions = dynamic(() => import('@/components/home/ActivePromotions'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
});
const MenuShowcase = dynamic(() => import('@/components/home/MenuShowcase'), {
  loading: () => <Skeleton className="h-[70vh] w-full" />,
});
const BrandStory = dynamic(() => import('@/components/home/BrandStory'), {
    loading: () => <Skeleton className="h-[60vh] w-full" />,
});
const OutletFinder = dynamic(() => import('@/components/home/OutletFinder'), {
  loading: () => <Skeleton className="h-[60vh] w-full" />,
});
const Community = dynamic(() => import('@/components/home/Community'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
});
const LatestStories = dynamic(() => import('@/components/home/LatestStories'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
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
