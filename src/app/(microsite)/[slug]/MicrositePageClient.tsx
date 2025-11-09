
'use client';

import { notFound, useParams } from 'next/navigation';
import type { Outlet, MenuItem, Promotion, MenuCategory, SiteSettings, Testimonial, Blog, PublicInstaPost } from '@/lib/types';
import { motion } from 'framer-motion';

import BrandStorySection from './(components)/BrandStorySection';
import OutletLocatorSection from './(components)/OutletLocatorSection';
import MicrositeHero from './(components)/MicrositeHero';
import InstaExploreGrid from '@/components/home/InstaExploreGrid';
import Community from '@/components/home/Community';
import LatestStories from '@/components/home/LatestStories';
import MicrositeNewsletterSignUp from './(components)/MicrositeNewsletterSignUp';
import FranchiseTestimonials from './(components)/FranchiseTestimonials';
import MenuShowcaseSection from './(components)/MenuShowcaseSection';
import PopularProductsCarousel from './(components)/PopularProductsCarousel';


// --- TYPES ---
interface PageData {
  outlet: (Outlet & { id: string }) | null;
  menuCategories: MenuCategory[];
  allMenuItems: MenuItem[];
  featuredItems: MenuItem[];
  promotions: Promotion[];
  reviews: Testimonial[];
  siteSettings: SiteSettings;
  latestBlog: Blog | null;
  instaPosts: PublicInstaPost[];
}

// MAIN CLIENT PAGE COMPONENT
export default function MicrositePageClient(data: PageData) {
  const { outlet, menuCategories, featuredItems, promotions, reviews, siteSettings, allMenuItems, latestBlog, instaPosts } = data;

  if (!outlet) {
    // This case should ideally be handled by the server component, but as a fallback:
    notFound();
  }
  
  return (
    <div className="bg-white text-black">
      <MicrositeHero outlet={outlet} />
      <main>
        <PopularProductsCarousel items={featuredItems} />
        <MenuShowcaseSection items={allMenuItems} categories={menuCategories} />
        {siteSettings && <BrandStorySection settings={siteSettings} />}
        <OutletLocatorSection currentOutlet={outlet} />
        {reviews && reviews.length > 0 && <FranchiseTestimonials testimonials={reviews} />}
        <InstaExploreGrid />
        <Community />
        <LatestStories />
        <MicrositeNewsletterSignUp />
      </main>
    </div>
  );
}
