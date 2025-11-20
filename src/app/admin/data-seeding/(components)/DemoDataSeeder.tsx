
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, AlertTriangle, Sparkles } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { seedDemoDataset } from '@/lib/seeder';

export default function DemoDataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeed = async () => {
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive'});
        return;
    }
    setIsSeeding(true);
    toast({ title: 'Demo Seed Initiated...', description: 'Populating database with multilingual sample data. This may take a moment.' });
    
    const result = await seedDemoDataset(firestore);
    
    if (result.success) {
      toast({ title: 'Success!', description: result.message, duration: 8000 });
    } else {
      toast({ variant: 'destructive', title: 'Seeding Failed', description: result.message, duration: 8000 });
      console.error("Demo Seed Error:", result.message);
    }
    setIsSeeding(false);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Sparkles /> Demo Data Seeder</CardTitle>
        <CardDescription className="text-zinc-400">
          Populate your database with a complete set of multilingual (English & Malay) sample data. This will only add data to empty collections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4 rounded-lg border border-primary/50 bg-primary/10 p-4">
          <AlertTriangle className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-semibold text-primary">Idempotent & Safe</h3>
            <p className="text-sm text-primary/80">
              This function is designed to be safe. It will **not** overwrite any existing data. It only adds documents to collections that are currently empty.
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default" className="mt-6 w-full" disabled={isSeeding}>
              {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Seed Demo Dataset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to seed the demo data?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                This will add a full set of sample documents to any empty collections. It will not affect collections that already contain data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-primary/90 text-primary-foreground hover:bg-primary/80" onClick={handleSeed}>Yes, seed the data</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
