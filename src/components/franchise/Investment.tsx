
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Skeleton } from '../ui/skeleton';
import { useMediaAsset } from '@/lib/media';

export default function Investment({ content }: { content: any }) {
  const { asset: stallImage, isLoading } = useMediaAsset('franchise-stall');
  
  if (!content) return null;
  const localizedContent = content.franchise?.investment;
  const { title, subtitle, content: investmentContent, buttonText, buttonLink } = localizedContent;

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll animationType="slideInFromLeft" className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-headline text-primary">
              {title}
            </h2>
            <p className="mt-4 text-xl text-muted-foreground" dangerouslySetInnerHTML={{ __html: subtitle.replace('RM25,000', '<span class="font-bold text-accent">RM25,000</span>') }} />
            <p className="mt-4 text-muted-foreground">
              {investmentContent}
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link href={buttonLink}>{buttonText}</Link>
            </Button>
          </AnimateOnScroll>

          <AnimateOnScroll animationType="slideInFromRight">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
                {isLoading || !stallImage ? <Skeleton className="w-full h-full" /> : (
                  <Image
                    src={stallImage.imageUrl}
                    alt={stallImage.description}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    data-ai-hint={stallImage.imageHint}
                  />
                )}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
