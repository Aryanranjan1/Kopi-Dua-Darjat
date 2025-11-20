
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, AlertTriangle, Coffee } from 'lucide-react';
import { seedMenuData } from '@/lib/seeder';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function MenuDataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedMenu = async () => {
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive'});
        return;
    }
    setIsSeeding(true);
    toast({ title: 'Menu Seed Initiated...', description: 'Wiping and re-seeding all menu data. This may take a moment.' });
    
    const result = await seedMenuData(firestore);
    
    if (result.success) {
      toast({ title: 'Success!', description: result.message, duration: 8000 });
    } else {
      toast({ variant: 'destructive', title: 'Menu Seed Failed', description: result.message, duration: 8000 });
      console.error("Menu Seed Error:", result.message);
    }
    setIsSeeding(false);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Coffee /> Menu Data Reset</CardTitle>
        <CardDescription className="text-zinc-400">
          Wipe all menu collections (Groups, Categories, Items) and re-seed with a complete set of 38 sample items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
          <div>
            <h3 className="font-semibold text-destructive">Warning: Destructive Action</h3>
            <p className="text-sm text-destructive/80">
              This will permanently delete all documents in your `menuGroups`, `menuCategories`, and `menuItems` collections before seeding new data.
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-6 w-full" disabled={isSeeding}>
              {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Coffee className="mr-2 h-4 w-4" />}
              Wipe & Seed Menu Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                This will delete all current menu data and reset it. Any custom menu changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleSeedMenu}>Yes, I understand. Wipe and seed.</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
