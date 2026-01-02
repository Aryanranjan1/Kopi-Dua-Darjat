
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, AlertTriangle, BookOpen, ImageIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { seedBlogs } from '@/lib/seeder';
import blogSeedData from './blog-seed.json';
import { seedMediaData } from '@/lib/media';

export default function DataSeedingPage() {
  const [isBlogSeeding, setIsBlogSeeding] = useState(false);
  const [isMediaSeeding, setIsMediaSeeding] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedBlogs = async () => {
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive'});
        return;
    }
    setIsBlogSeeding(true);
    toast({ title: 'Blog Seeding Initiated...', description: 'Wiping and re-seeding all posts. This may take a moment.', duration: 5000 });
    
    const result = await seedBlogs(firestore, blogSeedData);
    
    if (result.success) {
      toast({ title: 'Success!', description: result.message, duration: 8000 });
      window.location.reload();
    } else {
      toast({ variant: 'destructive', title: 'Action Failed', description: result.message, duration: 8000 });
      console.error("Blog Seeding Error:", result.error);
    }
    setIsBlogSeeding(false);
  };

  const handleSeedMedia = async () => {
    if (!firestore) {
      toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive' });
      return;
    }
    setIsMediaSeeding(true);
    toast({ title: 'Media Seeding Initiated...', description: 'Adding any missing media assets from local JSON file.' });

    const result = await seedMediaData(firestore);

    if (result.success) {
      toast({ title: 'Media Seed Complete!', description: result.message, duration: 8000 });
    } else {
      toast({ variant: 'destructive', title: 'Media Seed Failed', description: result.error, duration: 8000 });
    }
    setIsMediaSeeding(false);
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
              <Button variant="destructive" className="mt-6 w-full sm:w-auto" disabled={isBlogSeeding}>
                {isBlogSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
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
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleSeedBlogs}>Yes, wipe and re-seed</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

       <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon /> Media Assets Seeder</CardTitle>
          <CardDescription className="text-zinc-400">
            This tool will add any media assets from the local `placeholder-images.json` file that are not already present in your Firestore 'media' collection. It will not delete or overwrite existing assets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="mt-6 w-full sm:w-auto" disabled={isMediaSeeding}>
                {isMediaSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Seed Missing Media Assets
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Seed Media Assets?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This will check for and add any missing media assets to your database. This is a non-destructive action.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-blue-600 hover:bg-blue-700" onClick={handleSeedMedia}>Yes, seed media</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
