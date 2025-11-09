
'use client';

import { notFound } from 'next/navigation';
import type { Outlet, MenuItem, Promotion, MenuCategory, SiteSettings, Blog, PublicInstaPost, ReviewDocument } from '@/lib/types';

import BrandStorySection from './(components)/BrandStorySection';
import OutletLocatorSection from './(components)/OutletLocatorSection';
import MicrositeHero from './(components)/MicrositeHero';
import InstaExploreGrid from '@/components/home/InstaExploreGrid';
import Community from '@/components/home/Community';
import LatestStories from '@/components/home/LatestStories';
import MicrositeNewsletterSignUp from './(components)/MicrositeNewsletterSignUp';
import MenuShowcaseSection from './(components)/MenuShowcaseSection';
import PopularProductsCarousel from './(components)/PopularProductsCarousel';
import CustomerReviews from './(components)/CustomerReviews';


// --- TYPES ---
interface PageData {
  outlet: (Outlet & { id: string }) | null;
  menuCategories: MenuCategory[];
  allMenuItems: MenuItem[];
  featuredItems: MenuItem[];
  promotions: Promotion[];
  reviewData: ReviewDocument | null;
  siteSettings: SiteSettings;
  latestBlog: Blog | null;
  instaPosts: PublicInstaPost[];
}

// MAIN CLIENT PAGE COMPONENT
export default function MicrositePageClient(data: PageData) {
  const { outlet, menuCategories, featuredItems, promotions, reviewData, siteSettings, allMenuItems, latestBlog, instaPosts } = data;

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
        <CustomerReviews reviewData={reviewData} isLoading={false} />
        <InstaExploreGrid />
        <Community />
        <LatestStories />
        <MicrositeNewsletterSignUp />
      </main>
    </div>
  );
}
