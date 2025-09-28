import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Find answers to frequently asked questions about Kopi Dua Darjat.',
};

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-headline text-primary">Frequently Asked Questions</h1>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        Our helpful FAQ section is being prepared and will be available soon.
      </p>
    </div>
  );
}
