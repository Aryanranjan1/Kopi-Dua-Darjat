
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { allDrinks } from '@/lib/data';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { MenuCategory, MenuItem } from '@/lib/types';

// Define the structure for categories with groups and order
const categoryStructure: Record<string, { order: number, series: string[] }> = {
  'Seasonal / Specials': {
    order: 1,
    series: ['Menet Series'],
  },
  'Nak Kopi': {
    order: 2,
    series: ['Espresso Series', 'Darjat Series', 'Kopitiam Series'],
  },
  'Taknak Kopi': {
    order: 3,
    series: ['Coklat Series', 'Matcha Series'],
  },
};


export default function DataMigrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleClear = async () => {
    if (!firestore) return;
    if (!confirm('Are you sure you want to delete ALL menu items and categories? This cannot be undone.')) {
      return;
    }
    setIsClearing(true);
    setStatus('Clearing existing data...');
    try {
      const batch = writeBatch(firestore);
      const categoriesSnapshot = await getDocs(collection(firestore, 'menuCategories'));
      categoriesSnapshot.forEach(doc => batch.delete(doc.ref));
      const itemsSnapshot = await getDocs(collection(firestore, 'menuItems'));
      itemsSnapshot.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      setStatus('All menu data has been cleared.');
      toast({ title: 'Success', description: 'All menu data cleared from Firestore.' });
    } catch (error: any) {
      console.error('Error clearing data:', error);
      setStatus(`Error: ${error.message}`);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not clear data.' });
    } finally {
      setIsClearing(false);
    }
  };

  const handleMigrate = async () => {
    if (!firestore) return;
    setIsLoading(true);
    setStatus('Starting migration...');

    try {
      const batch = writeBatch(firestore);
      const categoriesRef = collection(firestore, 'menuCategories');
      const itemsRef = collection(firestore, 'menuItems');
      const existingCategories = new Map<string, string>();

      // 1. Clear existing data
      setStatus('Clearing existing menu data...');
      const categoriesSnapshot = await getDocs(collection(firestore, 'menuCategories'));
      categoriesSnapshot.forEach(doc => batch.delete(doc.ref));
      const itemsSnapshot = await getDocs(collection(firestore, 'menuItems'));
      itemsSnapshot.forEach(doc => batch.delete(doc.ref));
      
      // 2. Create categories from the defined structure
      setStatus('Processing categories...');
      let categoryOrder = 0;
      for (const [groupName, groupDetails] of Object.entries(categoryStructure)) {
        for (const seriesName of groupDetails.series) {
            const slug = seriesName.toLowerCase().replace(/ /g, '-');
            const newCategory: Omit<MenuCategory, 'id' | 'createdAt' | 'updatedAt'> = {
                name: seriesName,
                slug: slug,
                description: `Drinks from the ${seriesName}.`,
                group: groupName,
                displayOrder: ++categoryOrder,
            };
            const docRef = doc(categoriesRef);
            batch.set(docRef, { ...newCategory, createdAt: new Date(), updatedAt: new Date() });
            existingCategories.set(seriesName, docRef.id);
        }
      }
      
      // 3. Migrate drinks to menuItems
      setStatus('Migrating menu items...');
      allDrinks.forEach((drink, index) => {
        const categoryName = drink.tags.find(t => t.endsWith('Series'));
        const categoryId = categoryName ? existingCategories.get(categoryName) : null;
        
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

      // 4. Commit batch
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
            Use this tool to import the initial mock menu data into Firestore. This will set up categories, groups, and items based on the defined structure.
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
