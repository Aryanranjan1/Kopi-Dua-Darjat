
import type { Metadata } from 'next';
import { allDrinks } from '@/lib/data';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import MenuCarousel from '@/components/menu/MenuCarousel';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore the full range of drinks and bites at Kopi Dua Darjat.',
};

const nakKopiCategories = [
    { title: 'Darjat Series', tag: 'Darjat Series' },
    { title: 'Kopitiam Series', tag: 'Kopitiam Series' },
    { title: 'Espresso Series', tag: 'Espresso Series' },
];

const taknakKopiCategories = [
    { title: 'Coklat Series', tag: 'Coklat Series' },
    { title: 'Matcha Series', tag: 'Matcha Series' },
    { title: 'Menet Series', tag: 'Menet Series' },
];

export default function MenuPage() {
    const getDrinksByTag = (tag: string) => allDrinks.filter(drink => drink.tags.includes(tag));

  return (
    <div className="bg-background text-foreground">
        {/* Hero Section - Placeholder */}
        <section className="h-[40vh] bg-primary/20 flex items-center justify-center text-center">
            <AnimateOnScroll animationType="slideInFromBottom" className="container mx-auto px-4">
                <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary tracking-wider">
                Our Menu
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Handcrafted with passion, from classic heritage recipes to modern artisan creations.
                </p>
            </AnimateOnScroll>
        </section>

        <div className="py-12 sm:py-20 space-y-16">
            {/* NAK KOPI Section */}
            <section className="container mx-auto px-4">
                <h2 className="text-4xl font-headline text-center font-bold tracking-widest text-primary mb-12">NAK KOPI</h2>
                <div className="space-y-12">
                    {nakKopiCategories.map(cat => (
                        <MenuCarousel 
                            key={cat.tag}
                            title={cat.title}
                            items={getDrinksByTag(cat.tag)}
                        />
                    ))}
                </div>
            </section>

            {/* Add-ons Section */}
            <div className="py-8 bg-black">
                <div className="container mx-auto text-center text-white">
                    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-2xl">
                        <span>Caramel Drizzle <strong className="text-primary font-bold">+RM1</strong></span>
                        <span className="hidden md:block h-6 w-px bg-border/50"></span>
                        <span>Espresso Shot <strong className="text-primary font-bold">+RM2</strong></span>
                        <span className="hidden md:block h-6 w-px bg-border/50"></span>
                        <span>Add Syrup <strong className="text-primary font-bold">+RM1</strong></span>
                        <span className="hidden md:block h-6 w-px bg-border/50"></span>
                        <span>Sweet Foam <strong className="text-primary font-bold">+RM2</strong></span>
                    </div>
                </div>
            </div>

            {/* TAKNAK KOPI Section */}
            <section className="container mx-auto px-4">
                <h2 className="text-4xl font-headline text-center font-bold tracking-widest text-primary mb-12">TAKNAK KOPI</h2>
                 <div className="space-y-12">
                    {taknakKopiCategories.map(cat => (
                        <MenuCarousel 
                            key={cat.tag}
                            title={cat.title}
                            items={getDrinksByTag(cat.tag)}
                        />
                    ))}
                </div>
            </section>
        </div>
    </div>
  );
}
