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
        const outletRef = doc(outletsCollection);
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
          Use this tool to populate your Firestore database with 50 mock outlet locations. This will overwrite any existing outlet data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              Seed 50 Outlets
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                This will delete all current outlets in your database and replace them with 50 new mock outlets. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-emerald-600 hover:bg-emerald-700" onClick={handleMigrateOutlets}>
                Yes, Seed Outlets
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
