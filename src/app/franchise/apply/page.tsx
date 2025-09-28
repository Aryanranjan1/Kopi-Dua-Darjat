import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply for Franchise',
  description: 'Start your journey to becoming a Kopi Dua Darjat franchisee.',
};

export default function FranchiseApplyPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-headline text-primary">Franchise Application</h1>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        Our application form will be live here soon. Get ready to join our family!
      </p>
    </div>
  );
}
