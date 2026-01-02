'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { seedSiteSettings } from '@/lib/seeder';
import { Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


export default function DataSeedingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const firestore = useFirestore();

    const handleSeedData = async (seederFunction: (db: any) => Promise<void>, successMessage: string) => {
        if (!firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
            return;
        }

        setIsLoading(true);
        try {
            await seederFunction(firestore);
            toast({
                title: 'Success!',
                description: successMessage,
            });
            window.location.reload();
        } catch (error: any) {
            console.error("Error seeding data: ", error);
            toast({
                variant: "destructive",
                title: "Seeding Failed",
                description: `Could not seed data: ${error.message}`,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white flex items-center gap-2"><Database />Data Management</h1>
        
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Global Settings</CardTitle>
          <CardDescription className="text-zinc-400">
            Initialize or reset core website settings like contact info, social media links, and default metadata.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-start gap-4 rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
              <AlertTriangle className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-300">Information</h3>
                <p className="text-sm text-blue-400/80">
                  This action will populate the `settings/main` document in Firestore with default values. It will merge with existing settings but can overwrite fields.
                </p>
              </div>
          </div>
           <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button variant="outline" className="mt-6 w-full sm:w-auto" disabled={isLoading}>
                      {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                          <Database className="mr-2 h-4 w-4" />
                      )}
                      Seed Global Site Settings
                  </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                          This will seed the main site settings. This may overwrite some existing global configurations.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-blue-600 hover:bg-blue-700" onClick={() => handleSeedData(seedSiteSettings, "Global site settings have been seeded.")}>Yes, seed now</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}