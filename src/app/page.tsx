import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import StatsSection from '@/components/home/StatsSection';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedDrinks = dynamic(() => import('@/components/home/FeaturedDrinks'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
});
const ActivePromotions = dynamic(() => import('@/components/home/ActivePromotions'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
});
const OutletFinder = dynamic(() => import('@/components/home/OutletFinder'), {
  loading: () => <Skeleton className="h-[60vh] w-full" />,
});
const FranchiseTeaser = dynamic(() => import('@/components/home/FranchiseTeaser'), {
  loading: () => <Skeleton className="h-[60vh] w-full" />,
});
const LatestBlog = dynamic(() => import('@/components/home/LatestBlog'), {
  loading: () => <Skeleton className="h-[80vh] w-full" />,
});


export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="relative z-10">
        <Hero />
      </div>
      
      <div className="absolute top-[92vh] right-0 w-[40vw] h-[50vh] z-30 hidden md:block transform -translate-y-1/2">
        <Image
          src="/image/coffee.png"
          alt="Artisan coffee"
          fill
          priority
          className="object-contain rounded-xl shadow-2xl"
        />
      </div>

      <StatsSection />
      
      <div className="bg-secondary text-foreground">
        <FeaturedDrinks />
      </div>
      
      <ActivePromotions />

      <div className="w-full bg-secondary">
        <OutletFinder />
      </div>
      
      <div className="w-full bg-primary">
        <FranchiseTeaser />
      </div>

      <div className="bg-background">
        <LatestBlog />
      </div>
    </div>
  );
}
