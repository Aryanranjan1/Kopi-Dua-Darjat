
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { outlets as outletSeedData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, AlertTriangle } from 'lucide-react';
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

      // Clear existing outlets
      toast({ title: 'Clearing old data...', description: 'Removing existing outlets before seeding...' });
      const existingOutletsSnapshot = await getDocs(outletsCollection);
      existingOutletsSnapshot.forEach(document => {
        batch.delete(document.ref);
      });
      
      // Add new outlets from seed data
      toast({ title: 'Seeding new data...', description: `Adding ${outletSeedData.length} outlets...` });
      outletSeedData.forEach(outletData => {
        const outletRef = doc(firestore, 'outlets', outletData.slug); // Use slug as document ID
        batch.set(outletRef, { ...outletData, createdAt: new Date(), updatedAt: new Date() });
      });

      await batch.commit();
      
      toast({
        title: 'Migration Complete!',
        description: `${outletSeedData.length} outlets have been successfully seeded.`,
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
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Database /> Outlet Data Seeder</CardTitle>
        <CardDescription className="text-zinc-400">
          Use this tool to delete all existing outlets and re-populate the collection with the 50 sample outlets from the seed file.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
              <div>
                  <h3 className="font-semibold text-destructive">Warning: Destructive Action</h3>
                  <p className="text-sm text-destructive/80">
                  This will permanently delete all current documents in your 'outlets' collection before seeding the new data. This action cannot be undone.
                  </p>
              </div>
          </div>
          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="mt-6 w-full sm:w-auto" disabled={isLoading}>
                      {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                          <Database className="mr-2 h-4 w-4" />
                      )}
                      Delete All & Re-Seed Outlets
                  </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                          This action will delete all existing outlets and replace them. Any custom changes will be lost.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleMigrateOutlets}>Yes, delete and re-seed</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </CardContent>
    </Card>
  );
}
