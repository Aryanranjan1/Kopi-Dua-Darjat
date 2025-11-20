
import type { Metadata } from 'next';
import FranchiseCta from '@/components/outlets/FranchiseCta';
import InstaExploreGrid from '@/components/home/InstaExploreGrid';
import FooterCta from '@/components/outlets/FooterCta';
import OutletShowcase from '@/components/outlets/OutletShowcase';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import LatestStories from '@/components/home/LatestStories';
import TopRatedOutlets from '@/components/outlets/TopRatedOutlets';
import Community from '@/components/home/Community';

export const metadata: Metadata = {
  title: 'Outlets',
  description: 'Find a Kopi Dua Darjat outlet near you.',
};

function OutletShowcaseSkeleton() {
  return (
    <div className="py-24 sm:py-32">
        <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-4 mb-8 justify-center items-center">
                <Skeleton className="h-10 w-full md:flex-grow rounded-full" />
                <Skeleton className="h-10 w-44 rounded-full" />
                <Skeleton className="h-10 w-44 rounded-full" />
                <Skeleton className="h-10 w-44 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-96 w-full rounded-3xl" />
                ))}
            </div>
        </div>
    </div>
  );
}

function TopRatedSkeleton() {
    return (
        <div className="py-24 sm:py-32 bg-white">
            <div className="container mx-auto px-6 sm:px-12">
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                    <div className="lg:col-span-2 flex flex-col">
                        <Skeleton className="h-12 w-2/3" />
                        <Skeleton className="h-6 w-full mt-4" />
                        <div className="mt-8 flex-grow space-y-4">
                            <Skeleton className="h-24 w-full rounded-3xl" />
                            <Skeleton className="h-24 w-full rounded-3xl" />
                            <Skeleton className="h-24 w-full rounded-3xl" />
                        </div>
                    </div>
                    <div className="lg:col-span-3 min-h-[400px] sm:min-h-[600px] h-full mt-8 lg:mt-0">
                         <Skeleton className="h-full w-full rounded-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
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
        
        <Suspense fallback={<OutletShowcaseSkeleton />}>
            <OutletShowcase />
        </Suspense>
        
        <Suspense fallback={<TopRatedSkeleton />}>
            <TopRatedOutlets />
        </Suspense>
        
        {/* Franchise CTA */}
        <FranchiseCta />

        {/* Social Proof */}
        <InstaExploreGrid />
        
        <Community />
        
        {/* Latest Stories */}
        <LatestStories />

      </div>

      <FooterCta />
    </>
  );
}
