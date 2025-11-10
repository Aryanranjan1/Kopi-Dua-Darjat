
'use client';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import type { MenuCategory, MenuItem, MenuGroup, Promotion, DailySpecial } from '@/lib/types';
import MenuCarousel from '@/components/menu/MenuCarousel';
import MenuPromotions from '@/components/menu/MenuPromotions';
import { DailySpecials } from '@/components/menu/DailySpecials';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState, useEffect } from 'react';

export default function MenuPage() {
    const firestore = useFirestore();

    const groupsQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'menuGroups'), where('status', '==', 'published'), orderBy('displayOrder')) : null,
      [firestore]
    );
    const { data: menuGroups, isLoading: isLoadingGroups } = useCollection<MenuGroup>(groupsQuery);

    const categoriesQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'menuCategories'), where('status', '==', 'published'), orderBy('displayOrder')) : null,
      [firestore]
    );
    const { data: categories, isLoading: isLoadingCategories } = useCollection<MenuCategory>(categoriesQuery);
    
    const itemsQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'menuItems'), where('status', '==', 'published')) : null,
      [firestore]
    );
    const { data: menuItems, isLoading: isLoadingItems } = useCollection<MenuItem>(itemsQuery);

    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [dailySpecials, setDailySpecials] = useState<DailySpecial[]>([]);

    useEffect(() => {
        if (!firestore) return;
        const fetchOffers = async () => {
            const promosQuery = query(collection(firestore, 'promotions'), where('status', '==', 'active'));
            const promosSnap = await getDocs(promosQuery);
            setPromotions(promosSnap.docs.map(d => ({id: d.id, ...d.data()} as Promotion)));
            
            const specialsQuery = query(collection(firestore, 'dailySpecials'));
            const specialsSnap = await getDocs(specialsQuery);
            setDailySpecials(specialsSnap.docs.map(d => d.data() as DailySpecial));
        }
        fetchOffers();
    }, [firestore]);

    const getItemsByCategoryId = (categoryId: string) => {
        if (!menuItems) return [];
        return menuItems.filter(item => item.categoryId === categoryId);
    };

    const getCategoriesByGroupId = (groupId: string) => {
        if (!categories) return [];
        return categories.filter(cat => cat.groupId === groupId);
    }

    const isLoading = isLoadingGroups || isLoadingCategories || isLoadingItems;

    const AddonsSection = () => (
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
    );

    return (
        <>
            <div className="bg-background text-foreground">
                <section className="py-24 sm:py-32 text-center bg-primary">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground tracking-wider">
                            Our Menu
                        </h1>
                        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/80">
                            Handcrafted with passion, from classic heritage recipes to modern artisan creations.
                        </p>
                    </div>
                </section>

                <MenuPromotions />
                <DailySpecials />

                <div className="py-12 sm:py-20 space-y-16">
                    {isLoading ? (
                        <div className="container mx-auto px-4 space-y-12">
                            <Skeleton className="h-10 w-1/3 mx-auto" />
                            <Skeleton className="h-96 w-full" />
                            <Skeleton className="h-96 w-full" />
                        </div>
                    ) : (
                    <>
                        {menuGroups?.map((group, index) => {
                            const groupCategories = getCategoriesByGroupId(group.id);
                            if (groupCategories.length === 0) return null; // Don't render group if it has no visible categories
                            return (
                            <div key={group.id}>
                                <section className="container mx-auto px-4">
                                    <h2 className="text-5xl font-headline text-center font-bold tracking-widest text-foreground mb-12 underline decoration-primary decoration-4 underline-offset-8 uppercase">
                                        {group.name}
                                    </h2>
                                    <div className="space-y-12">
                                        {groupCategories.map(cat => {
                                            const categoryItems = getItemsByCategoryId(cat.id);
                                            if (categoryItems.length === 0) return null; // Don't render category if it has no items
                                            return (
                                                <MenuCarousel 
                                                    key={cat.id}
                                                    title={cat.name}
                                                    items={categoryItems}
                                                    promotions={promotions}
                                                    dailySpecials={dailySpecials}
                                                />
                                            )
                                        })}
                                    </div>
                                </section>
                                {index === 0 && <AddonsSection />}
                            </div>
                        )})}
                    </>
                    )}
                </div>
            </div>
            <NewsletterSignUp disableAnimations />
        </>
    );
}
