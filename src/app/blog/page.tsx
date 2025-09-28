import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, stories, and updates from the world of Kopi Dua Darjat.',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-headline text-primary">From the Coffee Press</h1>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        Our collection of articles and stories will be curated here soon.
      </p>
    </div>
  );
}
