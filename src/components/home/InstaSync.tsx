
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMedia } from '@/lib/media';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { Instagram } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export default function InstaSync() {
  const { data: media, isLoading } = useMedia();

  const instaPosts = media
    ? media.filter(item => item.id.startsWith('insta-post-')).slice(0, 4)
    : [];

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-12">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline text-primary">#KopiDuaDarjat</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Follow our journey and share your moments with us on Instagram. We love seeing our coffee in the wild!
          </p>
        </AnimateOnScroll>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl bg-muted" />
            ))
          ) : (
            instaPosts.map((post, index) => (
              <AnimateOnScroll key={post.id} animationType="fadeIn" delay={index * 0.1}>
                <Link href="#" className="block group">
                  <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src={post.imageUrl}
                      alt={post.description}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={post.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Instagram className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))
          )}
        </div>
        <AnimateOnScroll animationType="fadeIn" delay={0.4} className="mt-12 text-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Instagram className="mr-2 h-4 w-4" />
                Follow Us on Instagram
              </Link>
            </Button>
          </AnimateOnScroll>
      </div>
    </section>
  );
}
