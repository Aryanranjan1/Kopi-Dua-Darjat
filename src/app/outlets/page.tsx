import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Outlets',
  description: 'Find a Kopi Dua Darjat outlet near you.',
};

export default function OutletsPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-headline text-primary">Our Outlets</h1>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        Our interactive outlet directory with a map, search, and filters will be available here shortly.
      </p>
    </div>
  );
}
