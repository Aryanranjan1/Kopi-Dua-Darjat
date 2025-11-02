
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promotion Management',
  description: 'Manage promotions for Kopi Dua Darjat.',
};

export default function PromotionsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white">Promotion Management</h1>
      <p className="text-zinc-400">
        This section is under construction. Here you will be able to create and manage promotional offers for different items and outlets.
      </p>
    </div>
  );
}
