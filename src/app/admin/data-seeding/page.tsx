
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { blogSeedData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen, AlertTriangle } from 'lucide-react';
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

  const handleSeedBlogs = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
      return;
    }

    setIsLoading(true);

    try {
      const batch = writeBatch(firestore);
      
      // --- Seed Blogs ---
      toast({ title: 'Seeding new blogs...', description: 'Adding 15 new blog posts to the collection.' });

      blogSeedData.forEach(blogData => {
        // Use the explicit ID from seed data as the document ID
        const blogRef = doc(firestore, 'blogs', blogData.id);
        batch.set(blogRef, blogData);
      });

      // --- Commit Batch ---
      await batch.commit();
      
      toast({
        title: 'Blog Seeding Complete!',
        description: `${blogSeedData.length} blog posts have been added or updated.`,
        duration: 5000,
      });

    } catch (error: any) {
      console.error("Error seeding blog data: ", error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: `Could not seed blogs: ${error.message}`,
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
                <CardTitle className="flex items-center gap-2"><BookOpen /> Blog Post Seeder</CardTitle>
                <CardDescription className="text-zinc-400">
                Use this tool to populate your CMS with 15 new sample blog posts. This action only adds new data and will not delete existing posts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-400 mt-1" />
                    <div>
                        <h3 className="font-semibold text-yellow-300">Notice</h3>
                        <p className="text-sm text-yellow-400/80">
                        This action is non-destructive. It will add new blog posts from the seed file. If a post with the same ID already exists, it will be overwritten with the seed data.
                        </p>
                    </div>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="mt-6 w-full sm:w-auto text-yellow-400 border-yellow-500 hover:bg-yellow-400 hover:text-black" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <BookOpen className="mr-2 h-4 w-4" />
                            )}
                            Seed 15 Blog Posts
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to seed the blogs?</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-400">
                                This will add or overwrite 15 blog posts in your Firestore database.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-yellow-600 hover:bg-yellow-700" onClick={handleSeedBlogs}>Yes, proceed</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    </div>
  );
}
