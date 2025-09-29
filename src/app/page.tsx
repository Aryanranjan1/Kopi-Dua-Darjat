import Hero from '@/components/home/Hero';
import FeaturedDrinks from '@/components/home/FeaturedDrinks';
import ActivePromotions from '@/components/home/ActivePromotions';
import OutletFinder from '@/components/home/OutletFinder';
import FranchiseTeaser from '@/components/home/FranchiseTeaser';
import LatestBlog from '@/components/home/LatestBlog';
import StatsSection from '@/components/home/StatsSection';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const newImage = PlaceHolderImages.find((img) => img.id === 'new-section-image');

  return (
    <div className="flex flex-col">
      <div className="relative z-10">
        <Hero />
      </div>
      
      <div className="absolute top-[88vh] right-[50px] w-[30vw] aspect-square z-30 hidden md:block transform -translate-y-1/2">
        {newImage && (
          <Image
            src={newImage.imageUrl}
            alt={newImage.description}
            fill
            className="object-cover rounded-xl shadow-2xl"
            data-ai-hint={newImage.imageHint}
          />
        )}
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
