
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { allDrinks } from '@/lib/data';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { MenuGroup, MenuCategory, MenuItem } from '@/lib/types';

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
  const [status, setStatus] = useState<string | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const clearAllData = async () => {
    if (!firestore) return;
    setStatus('Clearing all existing menu data...');
    try {
      const batch = writeBatch(firestore);
      const collectionsToClear = ['menuGroups', 'menuCategories', 'menuItems', 'dailySpecials'];
      for (const col of collectionsToClear) {
        const snapshot = await getDocs(collection(firestore, col));
        snapshot.forEach(doc => batch.delete(doc.ref));
      }
      await batch.commit();
      setStatus('All menu data has been cleared.');
      toast({ title: 'Success', description: 'All menu data cleared from Firestore.' });
    } catch (error: any) {
      console.error('Error clearing data:', error);
      setStatus(`Error: ${error.message}`);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not clear data.' });
    }
  };


  const handleClear = async () => {
    if (!firestore) return;
    if (!confirm('Are you sure you want to delete ALL menu groups, categories, items, and specials? This cannot be undone.')) {
      return;
    }
    setIsClearing(true);
    await clearAllData();
    setIsClearing(false);
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
          <CardTitle>One-Time Data Migration</CardTitle>
          <CardDescription className="text-zinc-400">
            Use this tool to import the initial mock menu data into Firestore. This will set up groups, categories, and items based on the defined structure.
            Running this will first CLEAR all existing menu data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleMigrate} disabled={isLoading || isClearing} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Clear and Migrate Mock Menu Data
            </Button>
            <Button onClick={handleClear} disabled={isLoading || isClearing} variant="destructive" className="w-full sm:w-auto">
              {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
              Clear All Menu Data Only
            </Button>
          </div>
          {(isLoading || isClearing || status) && (
            <div className="p-4 bg-zinc-800 rounded-md">
              <h3 className="font-semibold text-zinc-300">Migration Status:</h3>
              <p className="text-sm text-zinc-400 font-mono">{status}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
