
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { outlets as outletSeedData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function OutletDataMigration() {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleMigrateOutlets = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
      return;
    }

    setIsLoading(true);

    try {
      const batch = writeBatch(firestore);
      const outletsCollection = collection(firestore, 'outlets');

      // Optional: Clear existing outlets if you want a fresh start
      const existingOutletsSnapshot = await getDocs(outletsCollection);
      existingOutletsSnapshot.forEach(document => {
        batch.delete(document.ref);
      });
      toast({ title: 'Clearing old data', description: 'Removing existing outlets before seeding...' });

      // Add new outlets
      outletSeedData.forEach(outletData => {
        const outletRef = doc(collection(firestore, 'outlets'));
        batch.set(outletRef, { ...outletData, createdAt: new Date(), updatedAt: new Date() });
      });

      await batch.commit();
      
      toast({
        title: 'Migration Complete!',
        description: `${outletSeedData.length} outlets have been successfully seeded into Firestore.`,
        duration: 5000,
      });

    } catch (error: any) {
      console.error("Error migrating outlets: ", error);
      toast({
        variant: 'destructive',
        title: 'Migration Failed',
        description: `Could not seed outlets: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white mt-8">
      <CardHeader>
        <CardTitle>Outlet Data Seeder</CardTitle>
        <CardDescription className="text-zinc-400">
          This tool is now deprecated. Please use the Master Data Seeding Tool in the main Admin Panel to manage all data, including outlets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-500">This component is kept for reference but its functionality has been moved to a centralized seeder.</p>
      </CardContent>
    </Card>
  );
}
