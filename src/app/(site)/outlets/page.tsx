
import type { Metadata } from 'next';
import FranchiseCta from '@/components/outlets/FranchiseCta';
import InstaExploreGrid from '@/components/home/InstaExploreGrid';
import FooterCta from '@/components/outlets/FooterCta';
import OutletShowcase from '@/components/outlets/OutletShowcase';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import LatestStories from '@/components/home/LatestStories';
import Testimonials from '@/app/(site)/franchise/Testimonials';

export const metadata: Metadata = {
  title: 'Outlets',
  description: 'Find a Kopi Dua Darjat outlet near you.',
};

function OutletShowcaseSkeleton() {
  return <Skeleton className="h-[600px] w-full rounded-2xl" />;
}

export default function OutletsPage() {
  return (
    <>
      <div className="bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-24 sm:py-32 text-center bg-primary">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground">
              Find An Outlet
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/80">
              Your daily dose of artisan Kopi Kampung is just around the corner.
            </p>
          </div>
        </section>
        
        {/* Our Presence Section */}
        <OutletShowcase />

        {/* Testimonials Section */}
        <Testimonials />
        
        {/* Franchise CTA */}
        <FranchiseCta />

        {/* Social Proof */}
        <InstaExploreGrid />
        
        {/* Latest Stories */}
        <LatestStories />
      </div>

      <FooterCta />
    </>
  );
}
