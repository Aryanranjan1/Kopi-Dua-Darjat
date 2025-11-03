'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import type { MenuItem, DailySpecial } from '@/lib/types';
import { Loader2, Sparkles, Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const SpecialsItemRow = ({ item, isSpecial, onToggle }: { item: MenuItem; isSpecial: boolean; onToggle: (itemId: string, isCurrentlySpecial: boolean) => void; }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
      <div className="flex flex-col">
        <p className="font-medium text-white">{item.name}</p>
        <p className="text-sm text-zinc-400">RM{item.price.toFixed(2)}</p>
      </div>
      <Switch
        id={`special-${item.id}`}
        checked={isSpecial}
        onCheckedChange={() => onToggle(item.id, isSpecial)}
      />
    </div>
  );
};


export default function DailySpecialsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const itemsQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'menuItems'), where('status', '==', 'published')) : null,
      [firestore]
    );
    const { data: menuItems, isLoading: isLoadingItems } = useCollection<MenuItem>(itemsQuery);

    const specialsQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'dailySpecials')) : null,
      [firestore]
    );
    const { data: dailySpecials, isLoading: isLoadingSpecials } = useCollection<DailySpecial>(specialsQuery);

    const specialItemIds = useMemo(() => new Set(dailySpecials?.map(s => s.menuItemId)), [dailySpecials]);

    const handleToggleSpecial = async (itemId: string, isCurrentlySpecial: boolean) => {
        if (!firestore) return;
        
        try {
            if (isCurrentlySpecial) {
                // Remove from specials
                const specialsRef = collection(firestore, 'dailySpecials');
                const q = query(specialsRef, where('menuItemId', '==', itemId));
                const querySnapshot = await getDocs(q);
                const batch = writeBatch(firestore);
                querySnapshot.forEach(document => {
                    batch.delete(document.ref);
                });
                await batch.commit();
                toast({ title: 'Success', description: 'Item removed from Daily Specials.' });
            } else {
                // Add to specials
                await addDoc(collection(firestore, 'dailySpecials'), {
                    menuItemId: itemId,
                    addedAt: serverTimestamp(),
                });
                toast({ title: 'Success', description: 'Item added to Daily Specials.' });
            }
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Error', description: `Could not update Daily Specials: ${error.message}` });
        }
    };
    
    const filteredMenuItems = useMemo(() => {
        if (!menuItems) return [];
        if (!searchTerm) return menuItems;
        const lowercasedQuery = searchTerm.toLowerCase();
        return menuItems.filter(item => item.name.toLowerCase().includes(lowercasedQuery));
    }, [menuItems, searchTerm]);


    const isLoading = isLoadingItems || isLoadingSpecials;

    return (
        <div className="space-y-8">
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>Daily Specials Management</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Toggle any published menu item to feature it on the "Daily Specials" section of the public menu page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input 
                            placeholder="Search menu items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-zinc-800 border-zinc-700 w-full"
                        />
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                         <div className="border border-zinc-800 rounded-lg max-h-[60vh] overflow-y-auto">
                            {filteredMenuItems.length > 0 ? (
                                filteredMenuItems.map(item => (
                                    <SpecialsItemRow 
                                        key={item.id}
                                        item={item}
                                        isSpecial={specialItemIds.has(item.id)}
                                        onToggle={handleToggleSpecial}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-zinc-500 p-8">No menu items found.</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
