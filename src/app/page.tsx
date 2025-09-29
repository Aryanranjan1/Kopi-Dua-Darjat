import Hero from '@/components/home/Hero';
import FeaturedDrinks from '@/components/home/FeaturedDrinks';
import ActivePromotions from '@/components/home/ActivePromotions';
import OutletFinder from '@/components/home/OutletFinder';
import FranchiseTeaser from '@/components/home/FranchiseTeaser';
import LatestBlog from '@/components/home/LatestBlog';
import Stats from '@/components/home/Stats';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <section className="relative z-10 w-full bg-secondary py-8 md:py-12 -mt-[15vh] md:-mt-[12vh]">
        <div className="container mx-auto">
          <Stats />
        </div>
      </section>
      <div className="bg-secondary text-foreground">
        <FeaturedDrinks />
      </div>
      <div className="w-full bg-primary text-primary-foreground">
        <ActivePromotions />
      </div>
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
