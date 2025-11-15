
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { blogSeedData, outlets as outletSeedData, menuGroups, menuCategories, menuItems, promotions, testimonialSeedData, communityItemsSeedData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen, AlertTriangle, Instagram, Database, Users } from 'lucide-react';
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
import type { Review, Testimonial } from '@/lib/types';


export default function DataSeedingPage() {
  const [isBlogLoading, setIsBlogLoading] = useState(false);
  const [isInstaLoading, setIsInstaLoading] = useState(false);
  const [isCommunityLoading, setIsCommunityLoading] = useState(false);
  const [isMasterLoading, setIsMasterLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleMasterSeed = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
      return;
    }

    setIsMasterLoading(true);
    toast({ title: 'Master Sync Initiated', description: 'This may take a moment...' });

    try {
      const collectionsToDelete = ['menuGroups', 'menuCategories', 'menuItems', 'outlets', 'promotions', 'reviews', 'testimonials'];
      const deleteBatch = writeBatch(firestore);

      for (const collectionName of collectionsToDelete) {
        const collectionRef = collection(firestore, collectionName);
        const snapshot = await getDocs(collectionRef);
        snapshot.forEach(document => deleteBatch.delete(document.ref));
      }
      await deleteBatch.commit();
      toast({ title: 'Phase 1/3: Collections Cleared', description: 'Existing data has been removed.' });
      
      const seedBatch = writeBatch(firestore);
      
      menuGroups.forEach(group => seedBatch.set(doc(collection(firestore, 'menuGroups'), group.id), group));
      menuCategories.forEach(category => seedBatch.set(doc(collection(firestore, 'menuCategories'), category.id), category));
      menuItems.forEach(item => seedBatch.set(doc(collection(firestore, 'menuItems'), item.id), item));
      promotions.forEach(promo => seedBatch.set(doc(collection(firestore, 'promotions')), promo));
      
      const outletsToSeed = outletSeedData.slice(0, 20);
      toast({ title: 'Phase 2/3: Seeding Core Data', description: 'Seeding menus, promotions, and outlets...' });

      for (const outlet of outletsToSeed) {
        const outletRef = doc(firestore, 'outlets', outlet.slug);
        
        const manualReviewsForOutlet: Testimonial[] = testimonialSeedData.filter(t => t.outletId === outlet.slug);
        const reviewCount = (outlet.reviewCount || 0) + manualReviewsForOutlet.length;
        
        // Let's create a simple average for seed data
        const totalManualRating = manualReviewsForOutlet.reduce((acc, review) => acc + (review.rating || 4), 0);
        const newRating = reviewCount > 0 
            ? (((outlet.rating || 0) * (outlet.reviewCount || 0)) + totalManualRating) / reviewCount
            : 0;

        const outletData = {
          ...outlet,
          rating: parseFloat(newRating.toFixed(1)),
          reviewCount: reviewCount,
          reviewsPath: `reviews/${outlet.slug}`,
          lastFetched: Timestamp.now(),
        };
        seedBatch.set(outletRef, outletData);

        const reviewDocRef = doc(firestore, 'reviews', outlet.slug);
        const reviews: Review[] = manualReviewsForOutlet.map(t => ({
            source: 'manual',
            author_name: t.name,
            rating: t.rating || 4,
            text: t.quote,
            time: Timestamp.now().seconds,
            attribution: 'Kopi Dua Darjat Website'
        }));
        
        seedBatch.set(reviewDocRef, {
            outletId: outlet.slug,
            aggregate: {
                ratingValue: parseFloat(newRating.toFixed(1)),
                reviewCount: reviewCount
            },
            reviews: reviews
        });
      }
      
      await seedBatch.commit();

      toast({
        title: 'Master Sync Complete!',
        description: 'All selected collections have been reset and re-seeded with fresh, interconnected data.',
        duration: 5000,
      });

    } catch (error: any) {
      console.error("Error with master seed: ", error);
      toast({
        variant: 'destructive',
        title: 'Master Sync Failed',
        description: `Could not complete the master seed: ${error.message}`,
      });
    } finally {
      setIsMasterLoading(false);
    }
  }


  const handleSeedBlogs = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
      return;
    }

    setIsBlogLoading(true);

    try {
      const batch = writeBatch(firestore);
      
      toast({ title: 'Seeding new blogs...', description: 'Adding 15 new blog posts to the collection.' });

      blogSeedData.forEach(blogData => {
        const blogRef = doc(firestore, 'blogs', blogData.id);
        batch.set(blogRef, blogData);
      });

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
      setIsBlogLoading(false);
    }
  };
  
  const handleSeedCommunityItems = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
      return;
    }
    setIsCommunityLoading(true);
    try {
      const batch = writeBatch(firestore);
      const collectionRef = collection(firestore, 'community_items');

      // Clear existing items
      const existingSnapshot = await getDocs(collectionRef);
      existingSnapshot.forEach(doc => batch.delete(doc.ref));

      // Add new items
      communityItemsSeedData.forEach((item, index) => {
        const docRef = doc(collectionRef, `item-${String(index).padStart(2, '0')}`);
        batch.set(docRef, {...item, displayOrder: index});
      });
      
      await batch.commit();
      toast({ title: 'Success', description: 'Community grid items have been seeded.' });
    } catch (error: any) {
      console.error("Error seeding community items: ", error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: `Could not seed community items: ${error.message}`,
      });
    } finally {
      setIsCommunityLoading(false);
    }
  }

  const handleSeedTestInstaPost = async () => {
      if (!firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
        return;
      }
      setIsInstaLoading(true);
      try {
        const batch = writeBatch(firestore);
        const collectionRef = collection(firestore, 'public_insta_feed');
        const captions = [
            "Kopi time! ☕ #kopiduadarjat",
            "That first sip feeling. #kopi",
            "Mid-day refuel. #coffeebreak",
            "Heritage in a cup. ✨",
            "Our favorite way to start the day.",
        ];

        for (let i = 1; i <= 20; i++) {
            const id = `post_${String(i).padStart(2, '0')}`;
            const postRef = doc(collectionRef, id);
            const mediaType = Math.random() > 0.7 ? 'VIDEO' : 'IMAGE';
            
            batch.set(postRef, {
                id,
                username: "kopiduadarjat",
                caption: captions[i % captions.length],
                mediaUrl: mediaType === 'VIDEO' 
                    ? `https://storage.googleapis.com/static-assets-2321/kdd-video-${(i%3)+1}.mp4`
                    : `https://picsum.photos/seed/${id}/600/600`,
                mediaType: mediaType.toUpperCase(),
                permalink: "https://www.instagram.com/p/mockPostID/",
                timestamp: new Date().toISOString(),
                visible: true,
                pinned: false,
                rank: i,
                source: "manual",
            });
        }
        
        await batch.commit();
        toast({ title: 'Success', description: '20 mock Instagram posts have been seeded.' });

      } catch (error: any) {
        console.error("Error seeding test Instagram post: ", error);
        toast({
          variant: 'destructive',
          title: 'Seeding Failed',
          description: `Could not seed test post: ${error.message}`,
        });
      } finally {
        setIsInstaLoading(false);
      }
  }

  return (
    <div className="space-y-8">
       <h1 className="text-3xl font-headline font-bold text-white">Master Data Seeding Tool</h1>
        
        <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database /> Master CMS Reset</CardTitle>
                <CardDescription className="text-zinc-400">
                This tool will delete all data from `outlets`, `menuGroups`, `menuCategories`, `menuItems`, `promotions`, and `reviews`, then re-seed them with fresh, interconnected sample data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
                    <div>
                        <h3 className="font-semibold text-destructive">Warning: Highly Destructive Action</h3>
                        <p className="text-sm text-destructive/80">
                        This will permanently delete all current documents in your core CMS collections. This action cannot be undone. Use this only to fix data inconsistencies or to start fresh.
                        </p>
                    </div>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="mt-6 w-full sm:w-auto" disabled={isMasterLoading}>
                            {isMasterLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Database className="mr-2 h-4 w-4" />
                            )}
                            Reset & Re-Seed All CMS Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-400">
                                This will delete all existing outlets, menus, promotions, and reviews and replace them. Any custom changes will be lost.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleMasterSeed}>Yes, delete and re-seed everything</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen /> Blog Post Seeder</CardTitle>
                <CardDescription className="text-zinc-400">
                Populate your CMS with 15 sample blog posts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto text-yellow-400 border-yellow-500 hover:bg-yellow-400 hover:text-black" disabled={isBlogLoading}>
                            {isBlogLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <BookOpen className="mr-2 h-4 w-4" />
                            )}
                            Seed Blog Posts
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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

        <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Community Grid Seeder</CardTitle>
                <CardDescription className="text-zinc-400">
                Populate the homepage community grid with sample items. This will clear existing items.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={handleSeedCommunityItems} className="w-full sm:w-auto" disabled={isCommunityLoading}>
                    {isCommunityLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Users className="mr-2 h-4 w-4" />
                    )}
                    Seed Community Items
                </Button>
            </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Instagram /> Insta-Feed Seeder</CardTitle>
                <CardDescription className="text-zinc-400">
                Add 20 mock posts to your Instagram feed collection.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={handleSeedTestInstaPost} className="w-full sm:w-auto" disabled={isInstaLoading}>
                    {isInstaLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Instagram className="mr-2 h-4 w-4" />
                    )}
                    Seed Mock Insta-Feed
                </Button>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}

    

    