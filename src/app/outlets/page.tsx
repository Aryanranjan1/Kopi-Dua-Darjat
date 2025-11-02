
import type { Metadata } from 'next';
import OutletsList from '@/components/outlets/OutletsList';
import FranchiseCta from '@/components/outlets/FranchiseCta';
import InstaSync from '@/components/home/InstaSync';
import FooterCta from '@/components/outlets/FooterCta';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import OutletShowcase from '@/components/outlets/OutletShowcase';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
        <AnimateOnScroll animationType="fadeIn">
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
        </AnimateOnScroll>
        
        {/* Our Presence Section */}
        <Suspense fallback={<OutletShowcaseSkeleton />}>
            <OutletShowcase />
        </Suspense>

        {/* Find an Outlet Section */}
        <OutletsList />
        
        {/* Franchise CTA */}
        <FranchiseCta />

        {/* Social Proof */}
        <InstaSync />
      </div>

      <FooterCta />
    </>
  );
}
