
import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedDrinks = dynamic(() => import('@/components/home/FeaturedDrinks'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
});
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
const InstaSync = dynamic(() => import('@/components/home/InstaSync'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
});
const LatestBlog = dynamic(() => import('@/components/home/LatestBlog'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
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
      <InstaSync />
      <LatestBlog />
    </div>
  );
}
