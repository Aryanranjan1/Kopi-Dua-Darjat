
'use client';

import type { MenuCategory } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

const CategoryCard = ({ category }: { category: MenuCategory }) => (
  <Link href={`/menu#${category.slug}`} className="block group">
    <AnimateOnScroll>
      <Card className="rounded-3xl overflow-hidden aspect-w-1 aspect-h-1 relative">
        <Image
          src={category.imageUrl || `https://picsum.photos/seed/${category.slug}/800/800`}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="text-2xl font-headline font-bold text-white">{category.name}</h3>
          <p className="text-white/80 text-sm mt-1">{category.description}</p>
        </div>
      </Card>
    </AnimateOnScroll>
  </Link>
);

export default function MenuCategoriesGrid({ categories }: { categories: MenuCategory[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-black">
            Explore Our Menu
          </h2>
          <p className="mt-2 text-lg text-neutral-600">
            From heritage brews to modern blends.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
