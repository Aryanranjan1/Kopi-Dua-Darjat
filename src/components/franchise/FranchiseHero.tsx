
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import Image from 'next/image';
import { useMediaAsset } from '@/lib/media';
import { Skeleton } from '../ui/skeleton';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { getLocalized } from '@/lib/utils';

export default function FranchiseHero({ content }: { content: any }) {
  const { language } = useLanguage();
  const { asset: bgImage, isLoading } = useMediaAsset('franchise-hero');
  const localizedContent = getLocalized(content, language).franchise?.hero;

  if (!localizedContent) return <div className="h-[70vh] bg-black" />;

  const { badge, title, subtitle, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink } = localizedContent;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 text-white overflow-hidden">
        {isLoading || !bgImage ? <Skeleton className="absolute inset-0 w-full h-full" /> : (
          <Image
              src={bgImage.imageUrl}
              alt={bgImage.description}
              fill
              className="absolute inset-0 w-full h-full object-cover z-0"
              priority
              data-ai-hint={bgImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      <div className="container mx-auto px-4 relative z-20">
        <div className="text-center lg:text-left lg:w-2/5">
             <AnimateOnScroll animationType="slideInFromBottom">
                <Badge variant="default" className="mb-4 text-sm py-1 px-4 rounded-full bg-accent text-accent-foreground">
                    {badge}
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-headline font-bold text-primary leading-tight drop-shadow-lg">
                    {title}
                </h1>
                <p className="mt-6 text-lg lg:text-xl text-white/90 drop-shadow-md">
                    {subtitle}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href={primaryButtonLink}>{primaryButtonText}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-black">
                        <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
                    </Button>
                </div>
            </AnimateOnScroll>
          </div>
      </div>
    </section>
  );
}
