
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { useLanguage } from '../layout/LanguageProvider';
import { siteContentData } from '@/lib/site-content';
import { siteContentDataMs } from '@/lib/site-content-ms';

export default function FranchiseHero() {
  const { language } = useLanguage();
  const content = language === 'ms' ? siteContentDataMs.franchise.hero : siteContentData.franchise.hero;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 text-white overflow-hidden">
        <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="/video/bg1.mp4"
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      <div className="container mx-auto px-4 relative z-20">
        <div className="text-center lg:text-left lg:w-2/5">
             <AnimateOnScroll animationType="slideInFromBottom">
                <Badge variant="default" className="mb-4 text-sm py-1 px-4 rounded-full bg-accent text-accent-foreground">
                    {content.badge}
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-headline font-bold text-primary leading-tight drop-shadow-lg">
                    {content.title}
                </h1>
                <p className="mt-6 text-lg lg:text-xl text-white/90 drop-shadow-md">
                    {content.subtitle}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href={content.primaryButtonLink}>{content.primaryButtonText}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-black">
                        <Link href={content.secondaryButtonLink}>{content.secondaryButtonText}</Link>
                    </Button>
                </div>
            </AnimateOnScroll>
          </div>
      </div>
    </section>
  );
}
