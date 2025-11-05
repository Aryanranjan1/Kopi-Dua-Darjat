
'use client';
import type { MenuCategory } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

interface MenuCategoriesGridProps {
  categories: MenuCategory[];
}

export default function MenuCategoriesGrid({ categories }: MenuCategoriesGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {categories.map((category, index) => (
            <AnimateOnScroll
              key={category.id}
              animationType="fadeIn"
              delay={index * 0.1}
              className="relative rounded-lg overflow-hidden group border border-black/10"
            >
              <Image
                // Fallback image if category doesn't have one
                src={category.imageUrl || `https://picsum.photos/seed/${category.slug}/600/800`}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-3xl font-headline font-bold text-white">{category.name}</h3>
                <p className="text-white/80 mt-1 line-clamp-2">{category.description}</p>
                <div className="mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Button variant="default" className="bg-[#F9C349] text-black hover:bg-[#F9C349]/90">
                    View Drinks
                  </Button>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
