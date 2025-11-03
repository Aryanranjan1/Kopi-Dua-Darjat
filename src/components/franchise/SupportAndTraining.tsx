
'use client';

import Image from 'next/image';
import { useMediaAsset } from '@/lib/media';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

const supportItems = [
    'Comprehensive Barista Training',
    'Stall Operations & Management',
    'Supply Chain & Inventory Control',
    'Local & National Marketing Support',
    'Ongoing Product Innovation'
]

export default function SupportAndTraining() {
  const { asset: trainingImage, isLoading } = useMediaAsset('franchise-training');

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll animationType="slideInFromRight">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
              {isLoading ? <Skeleton className="w-full h-full" /> : trainingImage && (
                <Image
                  src={trainingImage.imageUrl}
                  alt={trainingImage.description}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  data-ai-hint={trainingImage.imageHint}
                />
              )}
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animationType="slideInFromLeft" className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-headline text-primary">
              Full Support, From Setup to Sales
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We don’t just give you a logo — we teach you the system, supply chain, and marketing that keep sales brewing and customers happy.
            </p>
            <ul className="mt-6 space-y-3 text-left">
                {supportItems.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                    </li>
                ))}
            </ul>
             <Button asChild size="lg" className="mt-8 rounded-full">
                <Link href="/franchise/apply">Talk to Our Team</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
