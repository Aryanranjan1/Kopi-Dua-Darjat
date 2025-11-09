
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, AlertTriangle, MapPin } from 'lucide-react';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, writeBatch } from 'firebase/firestore';
import type { Outlet, Review, ReviewDocument } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function GooglePlacesSync() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const outletsWithPlaceIdQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'outlets'), where('placeId', '!=', null)) : null,
    [firestore]
  );
  const { data: outlets, isLoading: isLoadingOutlets } = useCollection<Outlet>(outletsWithPlaceIdQuery);

  const handleManualSync = async () => {
    if (!firestore || !outlets || outlets.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Sync Failed',
        description: 'No outlets with a Place ID found to sync.',
      });
      return;
    }
    
    setIsLoading(true);
    toast({
      title: 'Sync Initiated',
      description: `Fetching latest reviews for ${outlets.length} outlets. This may take a moment.`,
    });

    let successCount = 0;
    let errorCount = 0;
    
    // We process fetches in parallel but Firestore writes sequentially to avoid contention
    const updatePromises = outlets.map(async (outlet) => {
        if (!outlet.placeId) return;
      
        try {
            const response = await fetch('/api/fetch-google-place-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ placeId: outlet.placeId }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch from Google');

            return { outlet, fetchedData: data };
        } catch (error: any) {
            console.error(`Failed to fetch data for outlet ${outlet.name}:`, error);
            errorCount++;
            return null; // Indicate failure
        }
    });

    const results = await Promise.all(updatePromises);
    const validResults = results.filter(Boolean);

    if (validResults.length > 0 && firestore) {
        const batch = writeBatch(firestore);
        
        validResults.forEach(result => {
            if (!result) return;
            const { outlet, fetchedData } = result;

            // 1. Update the outlet document itself
            const outletRef = doc(firestore, 'outlets', outlet.id);
            batch.update(outletRef, {
            rating: fetchedData.rating,
            reviewCount: fetchedData.user_ratings_total,
            lastFetched: new Date(),
            });

            // 2. Update the reviews document
            const reviewDocRef = doc(firestore, 'reviews', outlet.id);
            const reviewData: ReviewDocument = {
            outletId: outlet.id,
            aggregate: {
                ratingValue: fetchedData.rating,
                reviewCount: fetchedData.user_ratings_total,
            },
            reviews: fetchedData.reviews.map((r: any): Review => ({
                source: 'google',
                author_name: r.author_name,
                rating: r.rating,
                text: r.text,
                time: r.time,
                profile_photo_url: r.profile_photo_url,
                relative_time_description: r.relative_time_description,
            })),
            };
            batch.set(reviewDocRef, reviewData, { merge: true }); // Merge to keep manual reviews if any
            successCount++;
        });

        try {
            await batch.commit();
        } catch(batchError) {
             console.error(`Batch commit failed:`, batchError);
             errorCount += validResults.length - successCount;
             successCount = 0; // Reset success count as batch failed
        }
    }


    setIsLoading(false);
    toast({
      title: 'Sync Complete!',
      description: `${successCount} outlets synced successfully. ${errorCount} failed.`,
    });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><RefreshCw /> Google Places Sync</CardTitle>
        <CardDescription className="text-zinc-400">
          Manually trigger a data sync from Google Places to update ratings and reviews for all outlets with a Place ID.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
          <div className="flex items-start gap-4 rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
              <AlertTriangle className="h-6 w-6 text-blue-400 mt-1" />
              <div>
                  <h3 className="font-semibold text-blue-300">How Syncing Works</h3>
                  <p className="text-sm text-blue-400/80">
                  This tool fetches the latest ratings and reviews directly from Google and updates your Firestore database. This ensures your microsites always show fresh, authentic customer feedback.
                  </p>
              </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-zinc-300">Outlets to be Synced ({outlets?.length || 0})</h4>
            <ScrollArea className="h-48 w-full rounded-md border border-zinc-700 bg-zinc-950/50 p-2">
              {isLoadingOutlets && <div className="flex justify-center items-center h-full"><Loader2 className="h-6 w-6 animate-spin"/></div>}
              {outlets && outlets.length > 0 ? (
                 <div className="space-y-2">
                  {outlets.map(outlet => (
                    <div key={outlet.id} className="flex items-center gap-2 text-sm p-2 rounded bg-zinc-800/50">
                      <MapPin className="h-4 w-4 text-zinc-500"/>
                      <span className="font-medium text-zinc-200">{outlet.name}</span>
                      <span className="text-xs text-zinc-400 truncate">({outlet.placeId})</span>
                    </div>
                  ))}
                 </div>
              ) : (
                <div className="flex justify-center items-center h-full text-zinc-500">
                  <p>No outlets with a Place ID found.</p>
                </div>
              )}
            </ScrollArea>
          </div>

          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto text-blue-400 border-blue-500 hover:bg-blue-400 hover:text-black" disabled={isLoading || !outlets || outlets.length === 0}>
                      {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Sync All ({outlets?.length || 0}) Outlets Now
                  </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to sync now?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                          This will initiate a request to the Google Places API for every outlet listed. This is safe, but should not be done excessively.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-zinc-700 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-blue-600 hover:bg-blue-700" onClick={handleManualSync}>Yes, sync now</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </CardContent>
    </Card>
  );
}
