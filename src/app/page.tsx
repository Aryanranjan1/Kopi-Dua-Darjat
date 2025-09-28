import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import FeaturedDrinks from '@/components/home/FeaturedDrinks';
import ActivePromotions from '@/components/home/ActivePromotions';
import OutletFinder from '@/components/home/OutletFinder';
import FranchiseTeaser from '@/components/home/FranchiseTeaser';
import LatestBlog from '@/components/home/LatestBlog';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Stats />
      <FeaturedDrinks />
      <ActivePromotions />
      <div className="w-full bg-secondary">
        <Separator className="bg-transparent" />
        <OutletFinder />
        <Separator className="bg-transparent" />
      </div>
      <FranchiseTeaser />
      <div className="bg-background">
        <LatestBlog />
      </div>
    </div>
  );
}
