import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about the history and passion behind Kopi Dua Darjat.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-headline text-primary">Our Story</h1>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        Detailed information about our founders, brand timeline, and brewing heritage is coming soon.
      </p>
    </div>
  );
}
