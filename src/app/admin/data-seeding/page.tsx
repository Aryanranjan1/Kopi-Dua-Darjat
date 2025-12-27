'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, AlertTriangle, Trash2, Instagram } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { clearMenuAndOutlets, seedSocialMediaPosts } from '@/lib/seeder';
import socialMediaSeedData from './social-media-seed.json';


export default function DataSeedingPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSocialSeeding, setIsSocialSeeding] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleWipeData = async () => {
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive'});
        return;
    }
    setIsSeeding(true);
    toast({ title: 'Data Wipe Initiated...', description: 'Deleting all menu and outlet documents. This may take a moment.', duration: 5000 });
    
    const result = await clearMenuAndOutlets(firestore);
    
    if (result.success) {
      toast({ title: 'Success!', description: result.message, duration: 8000 });
    } else {
      toast({ variant: 'destructive', title: 'Action Failed', description: result.message, duration: 8000 });
      console.error("Data Wipe Error:", result.message);
    }
    setIsSeeding(false);
  };

  const handleSeedSocialData = async () => {
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive'});
        return;
    }
    setIsSocialSeeding(true);
    toast({ title: 'Social Feed Seeding Initiated...', description: 'Wiping and re-seeding social posts. This may take a moment.', duration: 5000 });
    
    const result = await seedSocialMediaPosts(firestore, socialMediaSeedData);
    
    if (result.success) {
      toast({ title: 'Success!', description: `Successfully seeded ${result.count} social media posts.`, duration: 8000 });
    } else {
      toast({ variant: 'destructive', title: 'Action Failed', description: result.error || 'An unknown error occurred.', duration: 8000 });
      console.error("Social Media Seeding Error:", result.error);
    }
    setIsSocialSeeding(false);
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white flex items-center gap-2"><Database />Data Management</h1>
        
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database /> Wipe Menu & Outlet Data</CardTitle>
          <CardDescription className="text-zinc-400">
            This tool will permanently delete all documents from the 'menuItems', 'menuGroups', 'menuCategories', and 'outlets' collections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <AlertTriangle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-destructive">Warning: Highly Destructive Action</h3>
              <p className="text-sm text-destructive/80">
                This will permanently delete all menu structure and outlet data. This action cannot be undone and will break parts of your website until new data is added.
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-6 w-full" disabled={isSeeding}>
                {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Wipe All Menu & Outlet Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This will delete all menu items, categories, groups, and outlets. This action is irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleWipeData}>Yes, I understand. Wipe all data.</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
      
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Instagram /> Social Media Post Seeder</CardTitle>
          <CardDescription className="text-zinc-400">
            This tool will wipe the 'public_insta_feed' collection and re-populate it with a fresh set of sample data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <AlertTriangle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-destructive">Warning: Highly Destructive Action</h3>
              <p className="text-sm text-destructive/80">
                This will permanently delete all current posts in your social feed and replace them with the sample data. This action cannot be undone.
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-6 w-full" disabled={isSocialSeeding}>
                {isSocialSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Wipe & Re-seed Social Feed
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This will delete all existing social media posts and replace them with the sample set.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleSeedSocialData}>Yes, wipe and re-seed</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

    </div>
  );
}
