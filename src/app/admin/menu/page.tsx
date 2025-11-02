
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu Management',
  description: 'Manage menu items and categories for Kopi Dua Darjat.',
};

export default function MenuPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white">Menu Management</h1>
      <p className="text-zinc-400">
        This section is under construction. Here you will be able to add, edit, and delete menu items and categories.
      </p>
    </div>
  );
}
