
'use client';

import Image from 'next/image';
import { useMediaAsset } from '@/lib/media';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { siteContentData } from '@/lib/site-content';
import { siteContentDataMs } from '@/lib/site-content-ms';
import { useLanguage } from '../layout/LanguageProvider';

export default function SupportAndTraining() {
  const { asset: trainingImage, isLoading } = useMediaAsset('franchise-training');
  const { language } = useLanguage();
  const content = language === 'ms' ? siteContentDataMs.franchise.support : siteContentData.franchise.support;
  const { title, subtitle, items, buttonText, buttonLink } = content;

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
              {title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {subtitle}
            </p>
            <ul className="mt-6 space-y-3 text-left">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                    </li>
                ))}
            </ul>
             <Button asChild size="lg" className="mt-8 rounded-full">
                <Link href={buttonLink}>{buttonText}</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
