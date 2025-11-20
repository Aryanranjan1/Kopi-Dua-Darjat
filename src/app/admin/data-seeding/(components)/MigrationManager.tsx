
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, AlertTriangle, Wand2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { migrateAllToTranslations, clearAllCollections } from '@/lib/seeder';
import { Checkbox } from '@/components/ui/checkbox';

export default function MigrationManager() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleMigration = async () => {
    setIsMigrating(true);
    toast({ title: 'Migration Initiated...', description: `Running in ${dryRun ? 'dry-run' : 'live'} mode. This may take a moment.` });

    const result = await migrateAllToTranslations(firestore, dryRun);

    if (result.success) {
      toast({ title: 'Migration Complete!', description: `${result.message}` });
    } else {
      toast({ variant: 'destructive', title: 'Migration Failed', description: result.message });
      console.error("Migration Error:", result.message);
    }
    setIsMigrating(false);
  };
  
  const handleWipe = async () => {
    setIsWiping(true);
    toast({ title: 'Wipe Initiated...', description: `Clearing all managed collections.` });

    const result = await clearAllCollections(firestore);

    if (result.success) {
      toast({ title: 'Database Wiped!', description: `${result.message}` });
    } else {
      toast({ variant: 'destructive', title: 'Wipe Failed', description: result.message });
      console.error("Wipe Error:", result.message);
    }
    setIsWiping(false);
  };


  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wand2 /> Multilingual Migration</CardTitle>
          <CardDescription className="text-zinc-400">
            One-time script to migrate existing content to the new `translations` schema. It wraps current text fields into a `translations.en` object.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 mb-6">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-300">Important</h3>
              <p className="text-sm text-yellow-400/80">
                Run this script once to update your data structure. It's safe to run multiple times, as it will skip already migrated documents. Start with a "Dry Run" to see what will change.
              </p>
            </div>
          </div>
           <div className="flex items-center space-x-2 mb-6">
              <Checkbox id="dryRun" checked={dryRun} onCheckedChange={(checked) => setDryRun(checked as boolean)} />
              <label htmlFor="dryRun" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Dry Run (Log changes without writing to DB)
              </label>
            </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black" disabled={isMigrating}>
                {isMigrating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Migrate to Translations Schema
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Migration</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  You are about to run the migration script in <span className={dryRun ? "text-primary font-bold" : "text-destructive font-bold"}>{dryRun ? 'DRY-RUN' : 'LIVE'}</span> mode. This will process all documents in managed collections. Are you sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-yellow-600 hover:bg-yellow-700" onClick={handleMigration}>Yes, proceed.</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

       <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database /> Master Data Reset</CardTitle>
          <CardDescription className="text-zinc-400">
            Use this tool to completely wipe all content collections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
            <div>
              <h3 className="font-semibold text-destructive">Warning: Highly Destructive Action</h3>
              <p className="text-sm text-destructive/80">
                This will permanently delete all documents in your content collections. This action cannot be undone. Use this before seeding new data.
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-6 w-full" disabled={isWiping}>
                {isWiping ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Wipe All Content Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This will delete all content and reset your database to an empty state. Any custom changes will be permanently lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleWipe}>Yes, I understand. Wipe everything.</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
