
'use client';

import { notFound, useParams } from 'next/navigation';
import type { Outlet, MenuItem, Promotion, MenuCategory, SiteSettings, Testimonial } from '@/lib/types';
import { motion } from 'framer-motion';

import MenuCategoriesGrid from './(components)/MenuCategoriesGrid';
import SignatureDrinksCarousel from './(components)/SignatureDrinksCarousel';
import BentoGridSection from './(components)/PromotionsSection';
import BrandStorySection from './(components)/BrandStorySection';
import OutletLocatorSection from './(components)/OutletLocatorSection';
import MicrositeHero from './(components)/MicrositeHero';
import MenuShowcaseSection from './(components)/MenuShowcaseSection';
import InstaExploreGrid from '@/components/home/InstaExploreGrid';
import Community from '@/components/home/Community';
import LatestStories from '@/components/home/LatestStories';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

// --- TYPES ---
interface PageData {
  outlet: (Outlet & { id: string }) | null;
  menuCategories: MenuCategory[];
  allMenuItems: MenuItem[];
  featuredItems: MenuItem[];
  promotions: Promotion[];
  testimonials: Testimonial[];
  siteSettings: SiteSettings;
}

const Testimonials = ({ testimonials } : { testimonials: Testimonial[] }) => {
  if (!testimonials || testimonials.length === 0) return null;

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  const mappedTestimonials = (data: Testimonial[]) => data.map(item => ({
    text: item.quote,
    image: item.image,
    name: item.name,
    role: item.designation,
  }));

  return (
    <section className="bg-white py-20 md:py-32 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
        >
          <div className="border py-1 px-4 rounded-lg border-primary text-primary">Testimonials</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-black">
            What our customers say
          </h2>
          <p className="mt-5 opacity-75 text-neutral-600">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={mappedTestimonials(firstColumn)} duration={15} />
          <TestimonialsColumn testimonials={mappedTestimonials(secondColumn)} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={mappedTestimonials(thirdColumn)} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};


// MAIN CLIENT PAGE COMPONENT
export default function MicrositePageClient(data: PageData) {
  const { outlet, menuCategories, featuredItems, promotions, testimonials, siteSettings, allMenuItems } = data;

  if (!outlet) {
    // This case should ideally be handled by the server component, but as a fallback:
    notFound();
  }

  return (
    <div className="bg-white text-black">
      <MicrositeHero outlet={outlet} />
      <main>
        <SignatureDrinksCarousel items={featuredItems} promotions={promotions || []} />
        {promotions && promotions.length > 0 && <BentoGridSection promotions={promotions} items={featuredItems} />}
        <MenuCategoriesGrid categories={menuCategories} />
        {allMenuItems && <MenuShowcaseSection items={allMenuItems} />}
        {siteSettings && <BrandStorySection settings={siteSettings} />}
        <OutletLocatorSection currentOutlet={outlet} />
        {testimonials && testimonials.length > 0 && <Testimonials testimonials={testimonials} />}
        <InstaExploreGrid />
        <Community />
        <LatestStories />
        <NewsletterSignUp />
      </main>
    </div>
  );
}
