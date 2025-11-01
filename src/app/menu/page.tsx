
import type { Metadata } from 'next';
import MenuGrid from '@/components/menu/MenuGrid';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore the full range of drinks and bites at Kopi Dua Darjat.',
};

export default function MenuPage() {
  return <MenuGrid />;
}
