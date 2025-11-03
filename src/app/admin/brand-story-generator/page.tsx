
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { allDrinks } from '@/lib/data';
import { Loader2, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { MenuGroup, MenuCategory, MenuItem, Promotion } from '@/lib/types';

// Define the structure for categories with groups and order
const groupStructure: { name: string, order: number, series: { name: string, order: number }[] }[] = [
  {
    name: 'Seasonal / Specials',
    order: 1,
    series: [
      { name: 'Menet Series', order: 1 },
    ],
  },
  {
    name: 'Nak Kopi',
    order: 2,
    series: [
      { name: 'Espresso Series', order: 1 },
      { name: 'Darjat Series', order: 2 },
      { name: 'Kopitiam Series', order: 3 },
    ],
  },
  {
    name: 'Taknak Kopi',
    order: 3,
    series: [
      { name: 'Coklat Series', order: 1 },
      { name: 'Matcha Series', order: 2 },
    ],
  },
];


export default function DataMigrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isSeedingPromos, setIsSeedingPromos] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const clearAllData = async () => {
    if (!firestore) return;
    setStatus('Clearing all existing menu data...');
    try {
      const batch = writeBatch(firestore);
      const collectionsToClear = ['menuGroups', 'menuCategories', 'menuItems', 'dailySpecials', 'promotions'];
      for (const col of collectionsToClear) {
        const snapshot = await getDocs(collection(firestore, col));
        snapshot.forEach(doc => batch.delete(doc.ref));
      }
      await batch.commit();
      setStatus('All menu and promotion data has been cleared.');
      toast({ title: 'Success', description: 'All menu and promotion data cleared from Firestore.' });
    } catch (error: any) {
      console.error('Error clearing data:', error);
      setStatus(`Error: ${error.message}`);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not clear data.' });
    }
  };


  const handleClear = async () => {
    if (!firestore) return;
    if (!confirm('Are you sure you want to delete ALL menu groups, categories, items, specials, and promotions? This cannot be undone.')) {
      return;
    }
    setIsClearing(true);
    await clearAllData();
    setIsClearing(false);
  };

  const handleSeedPromotions = async () => {
    if (!firestore) return;
    setIsSeedingPromos(true);
    setStatus('Seeding 15 promotions...');
    try {
      // 1. Fetch menu items
      const itemsSnapshot = await getDocs(collection(firestore, 'menuItems'));
      const menuItems = itemsSnapshot.docs.map(d => ({ ...d.data(), id: d.id })) as MenuItem[];
      
      if (menuItems.length < 15) {
        throw new Error('Not enough menu items to create 15 promotions. Please migrate menu data first.');
      }

      const itemsToPromote = menuItems.slice(0, 15);
      const batch = writeBatch(firestore);

      for (let i = 0; i < itemsToPromote.length; i++) {
        const item = itemsToPromote[i];
        const promoRef = doc(collection(firestore, 'promotions'));
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + (i + 1) * 2); // Stagger end dates

        let discountType: Promotion['discountType'] = 'percentage';
        let discountValue = 10;
        if (i % 3 === 1) {
            discountType = 'flat';
            discountValue = 2;
        } else if (i % 3 === 2) {
            discountType = 'bogo';
            discountValue = 0;
        }

        const newPromo: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
          title: `${item.name} Special`,
          description: `A limited-time offer for our beloved ${item.name}.`,
          discountType,
          discountValue,
          startDate,
          endDate,
          menuItemIds: [item.id],
          outletIds: [], // Global promotion
        };

        batch.set(promoRef, {
            ...newPromo,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Link promotion to menu item
        const itemRef = doc(firestore, 'menuItems', item.id);
        const currentPromoIds = item.promotionIds || [];
        batch.update(itemRef, { promotionIds: [...currentPromoIds, promoRef.id] });
      }

      await batch.commit();
      setStatus('Successfully created and linked 15 new promotions.');
      toast({ title: 'Success', description: '15 promotions have been seeded.' });
    } catch (error: any) {
      console.error('Error seeding promotions:', error);
      setStatus(`Error seeding promotions: ${error.message}`);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
    setIsSeedingPromos(false);
  };

  const handleMigrate = async () => {
    if (!firestore) return;
    setIsLoading(true);
    setStatus('Starting migration...');

    try {
      // 1. Clear existing data first
      await clearAllData();

      const batch = writeBatch(firestore);
      const groupsRef = collection(firestore, 'menuGroups');
      const categoriesRef = collection(firestore, 'menuCategories');
      const itemsRef = collection(firestore, 'menuItems');
      
      const groupMap = new Map<string, string>();
      const categoryMap = new Map<string, string>();
      
      // 2. Create Groups
      setStatus('Creating menu groups...');
      for (const group of groupStructure) {
        const groupSlug = group.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const newGroup: Omit<MenuGroup, 'id' | 'createdAt' | 'updatedAt'> = {
          name: group.name,
          slug: groupSlug,
          displayOrder: group.order,
          status: 'published',
        };
        const groupDocRef = doc(groupsRef);
        batch.set(groupDocRef, { ...newGroup, createdAt: new Date(), updatedAt: new Date() });
        groupMap.set(group.name, groupDocRef.id);
      }
      
      // 3. Create Categories
      setStatus('Creating menu categories...');
      for (const group of groupStructure) {
        const groupId = groupMap.get(group.name);
        if (!groupId) continue;

        for (const series of group.series) {
          const categorySlug = series.name.toLowerCase().replace(/ /g, '-');
          const newCategory: Omit<MenuCategory, 'id' | 'createdAt' | 'updatedAt'> = {
            name: series.name,
            slug: categorySlug,
            description: `Drinks from the ${series.name}.`,
            groupId: groupId,
            displayOrder: series.order,
            status: 'published',
          };
          const catDocRef = doc(categoriesRef);
          batch.set(catDocRef, { ...newCategory, createdAt: new Date(), updatedAt: new Date() });
          categoryMap.set(series.name, catDocRef.id);
        }
      }
      
      // 4. Migrate drinks to menuItems
      setStatus('Migrating menu items...');
      allDrinks.forEach((drink, index) => {
        const categoryName = drink.tags.find(t => t.endsWith('Series'));
        const categoryId = categoryName ? categoryMap.get(categoryName) : null;
        
        if (!categoryId) {
          console.warn(`Could not find category for drink: ${drink.name}`);
          return; // Skip if no category
        }
        
        const newItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'> = {
          name: drink.name,
          slug: drink.slug,
          description: drink.description,
          price: drink.price,
          imageUrl: drink.image,
          categoryId: categoryId,
          promotionIds: [],
          outletIds: [],
          isGeneral: true,
          status: 'published',
          tags: drink.isFeatured ? ['featured'] : [],
          isPopular: drink.isFeatured,
          displayOrder: index + 1, // Simple ordering for now
        };
        const itemDocRef = doc(itemsRef);
        batch.set(itemDocRef, { ...newItem, createdAt: new Date(), updatedAt: new Date() });
      });

      // 5. Commit batch
      setStatus('Writing to database...');
      await batch.commit();

      setStatus('Migration completed successfully! All old data was cleared.');
      toast({ title: 'Migration Complete', description: 'Menu data has been cleared and re-imported successfully.' });
    } catch (error: any) {
      console.error('Migration failed:', error);
      setStatus(`Error: ${error.message}`);
      toast({ variant: 'destructive', title: 'Migration Failed', description: 'Check console for details.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>One-Time Data Tools</CardTitle>
          <CardDescription className="text-zinc-400">
            Use these tools to manage mock data in Firestore. These are for development and setup purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleMigrate} disabled={isLoading || isClearing || isSeedingPromos} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Clear and Migrate Mock Menu
            </Button>
            <Button onClick={handleSeedPromotions} disabled={isLoading || isClearing || isSeedingPromos} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                {isSeedingPromos ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Seed 15 Promotions
            </Button>
            <Button onClick={handleClear} disabled={isLoading || isClearing || isSeedingPromos} variant="destructive" className="w-full sm:w-auto">
              {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
              Clear All Menu Data
            </Button>
          </div>
          {(isLoading || isClearing || isSeedingPromos || status) && (
            <div className="p-4 bg-zinc-800 rounded-md">
              <h3 className="font-semibold text-zinc-300">Status:</h3>
              <p className="text-sm text-zinc-400 font-mono">{status}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    
