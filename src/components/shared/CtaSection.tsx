
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function CtaSection() {
    // Temporary placeholder data
  const bgImage = {
      imageUrl: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=1080",
      description: "A cup of coffee on a wooden table.",
      imageHint: "cup of coffee"
  };

  return (
    <section className="relative py-24 sm:py-32 text-white bg-black">
      <div className="absolute inset-0 z-0">
          <Image
            src={bgImage.imageUrl}
            alt={bgImage.description}
            fill
            sizes="100vw"
            className="object-cover"
            data-ai-hint={bgImage.imageHint}
          />
           <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>
      <div className="container mx-auto px-12 relative z-20">
        <div className="max-w-2xl text-center mx-auto">
          <AnimateOnScroll animationType="slideInFromBottom">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary leading-tight">
              Ready to Take a Perfect Shot?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Join our franchise family or simply find your nearest outlet for a perfect cup of coffee. We're excited to connect with you.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                <Link href="/franchise/apply">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
