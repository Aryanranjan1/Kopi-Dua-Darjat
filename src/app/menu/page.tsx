
import type { Metadata } from 'next';
import { allDrinks } from '@/lib/data';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import MenuCarousel from '@/components/menu/MenuCarousel';
import MenuPromotions from '@/components/menu/MenuPromotions';
import { DailySpecials } from '@/components/menu/DailySpecials';

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

        <MenuPromotions />
        <DailySpecials />

        <div className="py-12 sm:py-20 space-y-16">
            {/* NAK KOPI Section */}
            <section className="container mx-auto px-4">
                <h2 className="text-5xl font-headline text-center font-bold tracking-widest text-foreground mb-12 underline decoration-primary decoration-4 underline-offset-8">NAK KOPI</h2>
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
            <div className="py-16 bg-black">
                <div className="container mx-auto text-center text-white">
                    <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-12 gap-y-8">
                        <div className="flex flex-col text-center">
                            <span className="font-bold text-2xl sm:text-4xl">Caramel Drizzle</span>
                            <strong className="text-primary font-bold text-4xl sm:text-5xl">+RM1</strong>
                        </div>
                        <span className="hidden md:block h-16 w-px bg-border/50"></span>
                        <div className="flex flex-col text-center">
                            <span className="font-bold text-2xl sm:text-4xl">Espresso Shot</span>
                            <strong className="text-primary font-bold text-4xl sm:text-5xl">+RM2</strong>
                        </div>
                        <span className="hidden md:block h-16 w-px bg-border/50"></span>
                        <div className="flex flex-col text-center">
                            <span className="font-bold text-2xl sm:text-4xl">Add Syrup</span>
                            <strong className="text-primary font-bold text-4xl sm:text-5xl">+RM1</strong>
                        </div>
                        <span className="hidden md:block h-16 w-px bg-border/50"></span>
                        <div className="flex flex-col text-center">
                            <span className="font-bold text-2xl sm:text-4xl">Sweet Foam</span>
                            <strong className="text-primary font-bold text-4xl sm:text-5xl">+RM2</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* TAKNAK KOPI Section */}
            <section className="container mx-auto px-4">
                <h2 className="text-5xl font-headline text-center font-bold tracking-widest text-foreground mb-12 underline decoration-primary decoration-4 underline-offset-8">TAKNAK KOPI</h2>
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
