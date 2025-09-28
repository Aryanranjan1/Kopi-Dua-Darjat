import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promotions',
  description: 'Check out the latest deals and offers from Kopi Dua Darjat.',
};

export default function PromotionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-headline text-primary">Promotions</h1>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        A list of all our exciting promotions is coming soon. Stay tuned!
      </p>
    </div>
  );
}
