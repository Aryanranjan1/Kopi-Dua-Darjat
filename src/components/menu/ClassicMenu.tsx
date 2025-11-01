'use client';

import { allDrinks } from '@/lib/data';
import type { Drink } from '@/lib/types';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import MenuItemCard from './MenuItemCard';
import MenuCategory from './MenuCategory';

const nakKopiCategories = [
    { title: 'Darjat Series', description: 'Kopi susu latte dengan pilihan sirap berperisa dari Dua Darjat', tag: 'Darjat Series' },
    { title: 'Kopitiam Series', description: 'Kopi kampung yang lebih pekat dan ekstra kaw', tag: 'Kopitiam Series' },
    { title: 'Espresso Series', description: 'Kopi espreso menggunakan 100% biji kopi asli', tag: 'Espresso Series' },
];

const taknakKopiCategories = [
    { title: 'Coklat Series', description: 'Minuman coklat premium Dua Darjat', tag: 'Coklat Series' },
    { title: 'Matcha Series', description: 'Minuman matcha menggunakan 100% serbuk matcha asli', tag: 'Matcha Series' },
    { title: 'Menet Series', description: 'Minuman sparkling berperisa dari Dua Darjat', tag: 'Menet Series' },
];

export default function ClassicMenu() {
    const favouriteDrinks = allDrinks.filter(drink => drink.tags.includes('Our Favourites'));

    const getDrinksByTag = (tag: string) => allDrinks.filter(drink => drink.tags.includes(tag));

    return (
        <div>
            <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-12">
                {/* NAK KOPI Column */}
                <AnimateOnScroll animationType="slideInFromLeft" className="space-y-12">
                    <h2 className="text-4xl font-headline text-center font-bold tracking-widest text-primary">NAK KOPI</h2>
                    {nakKopiCategories.map(cat => (
                        <MenuCategory 
                            key={cat.tag}
                            title={cat.title}
                            description={cat.description}
                            items={getDrinksByTag(cat.tag)}
                        />
                    ))}
                </AnimateOnScroll>

                {/* TAKNAK KOPI Column */}
                <AnimateOnScroll animationType="slideInFromRight" className="space-y-12">
                     <h2 className="text-4xl font-headline text-center font-bold tracking-widest text-primary">TAKNAK KOPI</h2>
                    {taknakKopiCategories.map(cat => (
                        <MenuCategory 
                            key={cat.tag}
                            title={cat.title}
                            description={cat.description}
                            items={getDrinksByTag(cat.tag)}
                        />
                    ))}
                </AnimateOnScroll>
            </div>

            {/* Add-ons Section */}
            <AnimateOnScroll animationType='fadeIn' delay={0.4} className="mt-20 text-center text-muted-foreground">
                <div className="flex justify-center items-center gap-x-8">
                    <span>Caramel Drizzle <strong className="text-foreground">+RM1</strong></span>
                    <span className="h-4 w-px bg-border"></span>
                    <span>Espresso Shot <strong className="text-foreground">+RM2</strong></span>
                     <span className="h-4 w-px bg-border"></span>
                    <span>Add Syrup <strong className="text-foreground">+RM1</strong></span>
                     <span className="h-4 w-px bg-border"></span>
                    <span>Sweet Foam <strong className="text-foreground">+RM2</strong></span>
                </div>
            </AnimateOnScroll>

            {/* Our Favourites Section */}
            <AnimateOnScroll animationType='fadeIn' delay={0.6}>
                <div className="mt-20 text-center">
                    <h2 className="text-3xl font-headline font-bold text-primary tracking-widest">OUR FAVOURITES</h2>
                </div>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                    {favouriteDrinks.map(drink => (
                        <MenuItemCard key={drink.id} drink={drink} />
                    ))}
                </div>
                 <div className="mt-8 text-center text-muted-foreground font-semibold tracking-wider">
                    @KOPIDUADARJAT
                </div>
            </AnimateOnScroll>
        </div>
    );
}
