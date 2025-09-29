import Hero from '@/components/home/Hero';
import FeaturedDrinks from '@/components/home/FeaturedDrinks';
import ActivePromotions from '@/components/home/ActivePromotions';
import OutletFinder from '@/components/home/OutletFinder';
import FranchiseTeaser from '@/components/home/FranchiseTeaser';
import LatestBlog from '@/components/home/LatestBlog';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="bg-background text-foreground">
        <FeaturedDrinks />
      </div>
      <div className="w-full bg-primary relative text-primary-foreground">
        <div className="absolute top-0 left-0 w-full h-24 bg-background [clip-path:ellipse(100%_100%_at_50%_0%)]"></div>
        <ActivePromotions />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-secondary [clip-path:ellipse(100%_100%_at_50%_100%)]"></div>
      </div>
      <div className="w-full bg-secondary">
        <OutletFinder />
      </div>
       <div className="w-full bg-primary relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-secondary [clip-path:ellipse(100%_100%_at_50%_0%)]"></div>
        <FranchiseTeaser />
      </div>
      <div className="bg-background">
        <LatestBlog />
      </div>
    </div>
  );
}
