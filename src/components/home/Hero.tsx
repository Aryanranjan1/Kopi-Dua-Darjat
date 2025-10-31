import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Main Content Area */}
      <div className="container mx-auto px-12 z-10">
        <AnimateOnScroll animationType='slideInFromBottom'>
            <h1 className="font-headline text-5xl md:text-8xl font-bold tracking-tight text-primary drop-shadow-lg">
              Antara Warisan & Artisan.
            </h1>
            <p className="mt-6 text-lg text-foreground/80 max-w-2xl mx-auto">
              Experience the perfect blend of heritage and artisan coffee, crafted with passion and served with warmth in over 50+ outlets nationwide.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/menu">See The Menu</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Link href="/outlets">Find Outlet Near Me</Link>
              </Button>
            </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
