import Hero from '@/components/home/Hero';
import FeaturedDrinks from '@/components/home/FeaturedDrinks';
import ActivePromotions from '@/components/home/ActivePromotions';
import OutletFinder from '@/components/home/OutletFinder';
import FranchiseTeaser from '@/components/home/FranchiseTeaser';
import LatestBlog from '@/components/home/LatestBlog';
import StatsSection from '@/components/home/StatsSection';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="relative z-10">
        <Hero />
      </div>
      
      <div className="absolute top-[90vh] right-0 w-[40vw] h-[50vh] z-30 hidden md:block transform -translate-y-1/2">
        <Image
          src="/image/coffee.png"
          alt="Artisan coffee"
          fill
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
