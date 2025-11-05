
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, getDocs, doc, serverTimestamp } from 'firebase/firestore';
import { blogSeedData, outlets as outletSeedData } from '@/lib/data';
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

export default function DataSeedingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedData = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
      return;
    }

    setIsLoading(true);

    try {
      const batch = writeBatch(firestore);
      
      // --- Seed Blogs ---
      const blogsCollection = collection(firestore, 'blogs');
      toast({ title: 'Starting seeding...', description: 'Clearing existing blog posts.' });
      const existingBlogsSnapshot = await getDocs(blogsCollection);
      existingBlogsSnapshot.forEach(document => batch.delete(document.ref));
      
      blogSeedData.forEach(blogData => {
        const { id, ...data } = blogData;
        const blogRef = doc(firestore, 'blogs', id); // Use slug as the document ID
        batch.set(blogRef, {
            ...data,
            slug: id,
            id: id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            publishedAt: blogData.publishedAt || serverTimestamp(),
            views: 0,
            likes: 0,
        });
      });

      // --- Seed Outlets ---
       const outletsCollection = collection(firestore, 'outlets');
       toast({ title: 'Clearing old data', description: 'Removing existing outlets before seeding...' });
       const existingOutletsSnapshot = await getDocs(outletsCollection);
       existingOutletsSnapshot.forEach(document => batch.delete(document.ref));

      outletSeedData.forEach(outletData => {
        const outletRef = doc(firestore, 'outlets', outletData.slug); // Use slug as the document ID
        batch.set(outletRef, { ...outletData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      });

      // --- Commit Batch ---
      await batch.commit();
      
      toast({
        title: 'Seeding Complete!',
        description: `${blogSeedData.length} blog posts and ${outletSeedData.length} outlets have been successfully seeded.`,
        duration: 5000,
      });

    } catch (error: any) {
      console.error("Error seeding data: ", error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: `Could not seed data: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
       <h1 className="text-3xl font-headline font-bold text-white">Master Data Seeding Tool</h1>
        <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database /> Master Data Seeder</CardTitle>
                <CardDescription className="text-zinc-400">
                Use this tool to reset your content. It will delete all existing blog posts and outlets, then populate your CMS with a fresh set of sample data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-400 mt-1" />
                    <div>
                        <h3 className="font-semibold text-yellow-300">Warning: Destructive Action</h3>
                        <p className="text-sm text-yellow-400/80">
                        This action will permanently delete all current blog posts and outlets in your Firestore database before adding the new ones. This cannot be undone.
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
                            Seed All Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-400">
                                This will permanently delete all existing blogs & outlets and replace them with sample data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleSeedData}>Yes, proceed</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    </div>
  );
}
