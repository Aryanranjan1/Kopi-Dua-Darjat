import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Franchise',
  description: 'Join the Kopi Dua Darjat family. Learn more about our franchise opportunities.',
};

export default function FranchisePage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-headline text-primary">Become a Partner</h1>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        Detailed information about our franchise model, ROI calculator, and success stories is on its way.
      </p>
    </div>
  );
}
