
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, AlertTriangle } from 'lucide-react';
import { masterSeed } from '@/lib/seeder';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function MasterDataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleMasterSeed = async () => {
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive'});
        return;
    }
    setIsSeeding(true);
    toast({ title: 'Master Seed Initiated...', description: 'Wiping and re-seeding all data. This may take a moment and you will be notified upon completion.', duration: 10000 });
    
    const result = await masterSeed(firestore);
    
    if (result.success) {
      toast({ title: 'Success!', description: result.message, duration: 8000 });
    } else {
      toast({ variant: 'destructive', title: 'Master Seed Failed', description: result.message, duration: 8000 });
      console.error("Master Seed Error:", result.message);
    }
    setIsSeeding(false);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Database /> Master Data Reset</CardTitle>
        <CardDescription className="text-zinc-400">
          Use this tool to completely wipe all content collections and re-seed them with a full set of multilingual sample data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
          <div>
            <h3 className="font-semibold text-destructive">Warning: Highly Destructive Action</h3>
            <p className="text-sm text-destructive/80">
              This will permanently delete all documents in your content collections before seeding new data. This action cannot be undone and will reset your entire website's content.
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-6 w-full" disabled={isSeeding}>
              {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
              Wipe & Seed All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                This will delete all content and reset it to the default multilingual state. Any custom changes will be permanently lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleMasterSeed}>Yes, I understand. Wipe and seed.</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
