
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Skeleton } from '../ui/skeleton';
import { useMediaAsset } from '@/lib/media';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { getLocalized } from '@/lib/utils';

export default function FinalCta({ content }: { content: any }) {
  const { language } = useLanguage();
  const localizedContent = getLocalized(content, language).franchise?.finalCta;
  const { asset: ctaImage, isLoading } = useMediaAsset('franchise-cta');

  if (!localizedContent) return null;
  const { title, subtitle, buttonText, buttonLink } = localizedContent;

  return (
    <section className="bg-background">
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          {/* Left side: Text content */}
          <div className="flex flex-col justify-center bg-primary text-primary-foreground p-12 lg:p-24 text-center lg:text-left">
            <AnimateOnScroll animationType="slideInFromLeft">
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-foreground leading-tight">
                {title}
              </h2>
              <p className="mt-6 text-lg md:text-xl max-w-prose text-muted-foreground mx-auto lg:mx-0">
                {subtitle}
              </p>
              <div className="mt-10">
                <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-7 px-10">
                  <Link href={buttonLink}>{buttonText}</Link>
                </Button>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right side: Image */}
          <div className="relative min-h-[50vh] lg:min-h-0">
            {isLoading || !ctaImage ? <Skeleton className="w-full h-full" /> : (
              <Image
                  src={ctaImage.imageUrl}
                  alt={ctaImage.description}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  data-ai-hint={ctaImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
