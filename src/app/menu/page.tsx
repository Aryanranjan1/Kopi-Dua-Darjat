import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore the full range of drinks and bites at Kopi Dua Darjat.',
};

export default function MenuPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-headline text-primary">Our Menu</h1>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        Our full menu with categories, descriptions, and pricing will be available here soon.
      </p>
    </div>
  );
}
