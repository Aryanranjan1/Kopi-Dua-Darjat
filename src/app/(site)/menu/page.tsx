
'use client';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { MenuCategory, MenuItem } from '@/lib/types';
import MenuCarousel from '@/components/menu/MenuCarousel';
import MenuPromotions from '@/components/menu/MenuPromotions';
import { DailySpecials } from '@/components/menu/DailySpecials';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function MenuPage() {
    const firestore = useFirestore();

    const categoriesQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'menuCategories'), orderBy('name')) : null,
      [firestore]
    );
    const { data: categories, isLoading: isLoadingCategories } = useCollection<MenuCategory>(categoriesQuery);
    
    const itemsQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'menuItems'), where('status', '==', 'published')) : null,
      [firestore]
    );
    const { data: menuItems, isLoading: isLoadingItems } = useCollection<MenuItem>(itemsQuery);

    const { groupedCategories, standaloneCategories } = useMemo(() => {
        if (!categories) return { groupedCategories: new Map(), standaloneCategories: [] };

        const grouped = new Map<string, MenuCategory[]>();
        const standalone: MenuCategory[] = [];
        const subCategories = new Map<string, MenuCategory[]>();

        categories.forEach(cat => {
            if (cat.parentId) {
                if (!subCategories.has(cat.parentId)) {
                    subCategories.set(cat.parentId, []);
                }
                subCategories.get(cat.parentId)!.push(cat);
            }
        });

        const topLevelCategories = categories.filter(c => !c.parentId);

        topLevelCategories.forEach(cat => {
            if (cat.group) {
                if (!grouped.has(cat.group)) {
                    grouped.set(cat.group, []);
                }
                grouped.get(cat.group)!.push(cat);
                // Also add its subcategories under the same group for display logic
                const subs = subCategories.get(cat.id) || [];
                grouped.get(cat.group)!.push(...subs);
            } else {
                standalone.push(cat);
                const subs = subCategories.get(cat.id) || [];
                standalone.push(...subs);
            }
        });

        return { groupedCategories: grouped, standaloneCategories: standalone };
    }, [categories]);

    const getItemsByCategoryId = (categoryId: string) => {
        if (!menuItems) return [];
        return menuItems.filter(item => item.categoryId === categoryId);
    };

    const isLoading = isLoadingCategories || isLoadingItems;

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
                <section className="h-[40vh] bg-primary/20 flex items-center justify-center text-center">
                    <div className="container mx-auto px-4">
                        <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary tracking-wider">
                            Our Menu
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
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
                        {Array.from(groupedCategories.entries()).map(([groupName, groupCategories], index) => (
                            <div key={groupName}>
                                <section className="container mx-auto px-4">
                                    <h2 className="text-5xl font-headline text-center font-bold tracking-widest text-foreground mb-12 underline decoration-primary decoration-4 underline-offset-8 uppercase">
                                        {groupName}
                                    </h2>
                                    <div className="space-y-12">
                                        {groupCategories.filter(c => !c.parentId).map(cat => (
                                            <MenuCarousel 
                                                key={cat.id}
                                                title={cat.name}
                                                items={getItemsByCategoryId(cat.id)}
                                            />
                                        ))}
                                    </div>
                                </section>
                                {(index === 0 && Array.from(groupedCategories.entries()).length > 1) && <AddonsSection />}
                            </div>
                        ))}
                        
                        {Array.from(groupedCategories.entries()).length <= 1 && <AddonsSection />}
                        
                        {standaloneCategories.length > 0 && (
                             <section className="container mx-auto px-4">
                                <h2 className="text-5xl font-headline text-center font-bold tracking-widest text-foreground mb-12 underline decoration-primary decoration-4 underline-offset-8 uppercase">
                                    More To Explore
                                </h2>
                                <div className="space-y-12">
                                    {standaloneCategories.filter(c => !c.parentId).map(cat => (
                                        <MenuCarousel 
                                            key={cat.id}
                                            title={cat.name}
                                            items={getItemsByCategoryId(cat.id)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                    )}
                </div>
            </div>
            <NewsletterSignUp disableAnimations />
        </>
    );
}
