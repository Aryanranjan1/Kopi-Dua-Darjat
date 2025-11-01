import type { Metadata } from 'next';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import Link from 'next/link';
import { ArrowRight, Calendar, Users, Coffee } from 'lucide-react';
import InstaSync from '@/components/about/InstaSync';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about the history and passion behind Kopi Dua Darjat.',
};

export default function AboutPage() {
  const founderHadi = PlaceHolderImages.find((img) => img.id === 'founder-hadi');
  const founderAzad = PlaceHolderImages.find((img) => img.id === 'founder-azad');
  const brandTimeline = PlaceHolderImages.find((img) => img.id === 'brand-timeline');
  const brewingMethod = PlaceHolderImages.find((img) => img.id === 'brewing-method');

  const timelineEvents = [
    {
      icon: Calendar,
      title: 'Founded in Nov 2020',
      description: 'Hadi and Azad started with a single vision: to share authentic Kopi Kampung with a modern twist.',
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Built a loyal following by focusing on quality, affordability, and a warm, welcoming atmosphere.',
    },
    {
      icon: Coffee,
      title: '50+ Outlets & Counting',
      description: 'Rapidly expanded across Malaysia, bringing our unique coffee experience to more communities.',
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[60vh] text-primary-foreground flex items-center justify-center text-center">
        <div className="absolute inset-0 z-[-2]">
          {brandTimeline && (
            <Image
              src={brandTimeline.imageUrl}
              alt={brandTimeline.description}
              fill
              className="object-cover"
              data-ai-hint={brandTimeline.imageHint}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black/60 z-[-1]"></div>
        <div className="container relative z-10 px-4">
          <AnimateOnScroll animationType="slideInFromBottom">
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary drop-shadow-lg">
              Our Story
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/90">
              Antara Warisan & Artisan: The journey of bridging generations through coffee.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <InstaSync />

      {/* Founders Section */}
      <section className="py-24 sm:py-32 bg-card">
        <div className="container mx-auto px-12">
          <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-foreground">Meet the Founders</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Kopi Dua Darjat was brought to life by two friends, Hadi and Azad, who shared a common passion for Malaysia's rich coffee heritage and a vision to make it accessible to everyone.
            </p>
          </AnimateOnScroll>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <AnimateOnScroll animationType="slideInFromLeft">
              <div className="text-center">
                {founderHadi && (
                  <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-primary">
                    <Image
                      src={founderHadi.imageUrl}
                      alt="Founder Hadi"
                      fill
                      className="object-cover"
                      data-ai-hint={founderHadi.imageHint}
                    />
                  </div>
                )}
                <h3 className="mt-6 text-2xl font-headline text-accent">Hadi</h3>
                <p className="mt-2 text-muted-foreground">The Visionary</p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animationType="slideInFromRight">
              <div className="text-center">
                {founderAzad && (
                  <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-primary">
                    <Image
                      src={founderAzad.imageUrl}
                      alt="Founder Azad"
                      fill
                      className="object-cover"
                       data-ai-hint={founderAzad.imageHint}
                    />
                  </div>
                )}
                <h3 className="mt-6 text-2xl font-headline text-accent">Azad</h3>
                <p className="mt-2 text-muted-foreground">The Craftsman</p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Timeline & Mission Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-12">
          <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-primary">From A Stall to A Story</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our journey is a testament to passion and perseverance. Since November 2020, we have grown from a humble stall to a beloved brand with over 50 outlets, never losing sight of our mission.
            </p>
          </AnimateOnScroll>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {timelineEvents.map((event, index) => (
              <AnimateOnScroll key={index} animationType="fadeIn" delay={index * 0.1}>
                <div className="p-8 rounded-lg bg-card shadow-md text-center h-full">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-full">
                      <event.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-headline text-foreground">{event.title}</h3>
                  <p className="mt-2 text-muted-foreground">{event.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Brewing Heritage Section */}
      <section className="py-24 sm:py-32 bg-black text-white">
        <div className="container mx-auto px-12 grid md:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll animationType="slideInFromLeft">
            <h2 className="text-4xl md:text-5xl font-headline text-primary leading-tight">The Art of Kopi Kampung</h2>
            <p className="mt-6 text-lg text-white/80">
              Our soul lies in the Kopi Kampung heritage. We honor traditional brewing methods, using carefully selected local beans roasted to perfection. This commitment to authenticity ensures that every cup of Kopi Dua Darjat is a nostalgic journey back to the flavors we grew up with, elevated with an artisan's touch.
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/menu">
                Taste the Tradition <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimateOnScroll>
          <AnimateOnScroll animationType="slideInFromRight">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
              {brewingMethod && (
                <Image
                  src={brewingMethod.imageUrl}
                  alt={brewingMethod.description}
                  fill
                  className="object-cover"
                  data-ai-hint={brewingMethod.imageHint}
                />
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
