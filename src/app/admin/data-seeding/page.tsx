
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, AlertTriangle, BookOpen } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { seedBlogs } from '@/lib/seeder';
import blogSeedData from './blog-seed.json';

export default function DataSeedingPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedData = async () => {
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive'});
        return;
    }
    setIsSeeding(true);
    toast({ title: 'Blog Seeding Initiated...', description: 'Wiping and re-seeding all posts. This may take a moment.', duration: 5000 });
    
    const result = await seedBlogs(firestore, blogSeedData);
    
    if (result.success) {
      toast({ title: 'Success!', description: result.message, duration: 8000 });
    } else {
      toast({ variant: 'destructive', title: 'Action Failed', description: result.message, duration: 8000 });
      console.error("Data Seeding Error:", result.error);
    }
    setIsSeeding(false);
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white flex items-center gap-2"><Database />Data Management</h1>
        
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen /> Blog Posts Seeder</CardTitle>
          <CardDescription className="text-zinc-400">
            This tool will permanently delete all documents from the 'blogs' collection and re-populate them with fresh sample data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <AlertTriangle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-destructive">Warning: Highly Destructive Action</h3>
              <p className="text-sm text-destructive/80">
                This will permanently delete all blog posts. This action cannot be undone. Use this to reset your content to the provided sample data.
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-6 w-full sm:w-auto" disabled={isSeeding}>
                {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Wipe & Re-seed Blog Posts
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This will delete all existing blog posts and replace them with the sample set.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleSeedData}>Yes, wipe and re-seed</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

    