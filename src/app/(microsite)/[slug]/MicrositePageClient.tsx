
'use client';

import { notFound, useParams } from 'next/navigation';
import type { Outlet, MenuItem, Promotion, MenuCategory, SiteSettings, Testimonial } from '@/lib/types';
import { motion } from 'framer-motion';

import SignatureDrinksCarousel from './(components)/SignatureDrinksCarousel';
import BrandStorySection from './(components)/BrandStorySection';
import OutletLocatorSection from './(components)/OutletLocatorSection';
import MicrositeHero from './(components)/MicrositeHero';
import InstaExploreGrid from '@/components/home/InstaExploreGrid';
import Community from '@/components/home/Community';
import LatestStories from '@/components/home/LatestStories';
import MicrositeNewsletterSignUp from './(components)/MicrositeNewsletterSignUp';
import FranchiseTestimonials from './(components)/FranchiseTestimonials';
import MenuShowcaseSection from './(components)/MenuShowcaseSection';


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
        <SignatureDrinksCarousel items={featuredItems} />
        {allMenuItems && <MenuShowcaseSection items={allMenuItems} />}
        {siteSettings && <BrandStorySection settings={siteSettings} />}
        <OutletLocatorSection currentOutlet={outlet} />
        {testimonials && testimonials.length > 0 && <FranchiseTestimonials />}
        <InstaExploreGrid />
        <Community />
        <LatestStories />
        <MicrositeNewsletterSignUp />
      </main>
    </div>
  );
}
