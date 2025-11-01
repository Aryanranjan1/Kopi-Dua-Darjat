import type { Metadata } from 'next';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import ClassicMenu from '@/components/menu/ClassicMenu';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore the full range of drinks and bites at Kopi Dua Darjat.',
};

export default function MenuPage() {
  return (
    <div className="bg-background text-foreground py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary tracking-wider">
            Our Menu
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Handcrafted with passion, from classic heritage recipes to modern artisan creations.
            </p>
        </AnimateOnScroll>
        <ClassicMenu />
      </div>
    </div>
  );
}
