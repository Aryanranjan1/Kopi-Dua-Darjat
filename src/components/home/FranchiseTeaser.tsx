import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CircularTestimonials } from '@/components/home/CircularTestimonials';
import { testimonials } from '@/lib/data';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function FranchiseTeaser() {
  return (
    <section className="text-primary-foreground py-24 sm:py-32">
      <div className="container mx-auto px-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <AnimateOnScroll animationType="slideInFromLeft" className="w-full flex items-center justify-center">
                <CircularTestimonials testimonials={testimonials} autoplay={true} />
            </AnimateOnScroll>
          <div className="text-center md:text-left">
            <AnimateOnScroll animationType="slideInFromRight">
              <h2 className="font-headline text-4xl font-bold">
                Berminat jadi rakan niaga?
              </h2>
              <p className="mt-4 text-lg max-w-prose text-primary-foreground/80">
                Pelaburan kopi yang terbukti menguntungkan. Join a fast-growing Malaysian brand and bring the taste of Kopi Dua Darjat to your community.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/franchise">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
