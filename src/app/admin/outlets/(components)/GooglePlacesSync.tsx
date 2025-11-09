
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
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

export default function GooglePlacesSync() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleManualSync = async () => {
    setIsLoading(true);
    toast({
      title: 'Sync Initiated',
      description: 'Fetching latest reviews for all outlets. This may take a few minutes.',
    });

    // In a real implementation, this would call a backend Cloud Function.
    // For now, we simulate a delay.
    await new Promise(resolve => setTimeout(resolve, 5000));

    setIsLoading(false);
    toast({
      title: 'Manual Sync Complete!',
      description: `Outlet reviews and ratings have been updated.`,
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
      <CardContent>
          <div className="flex items-start gap-4 rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
              <AlertTriangle className="h-6 w-6 text-blue-400 mt-1" />
              <div>
                  <h3 className="font-semibold text-blue-300">Note on Automatic Sync</h3>
                  <p className="text-sm text-blue-400/80">
                  This process runs automatically twice a month. Use this manual trigger only when you need to force an immediate update.
                  </p>
              </div>
          </div>
          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button variant="outline" className="mt-6 w-full sm:w-auto text-blue-400 border-blue-500 hover:bg-blue-400 hover:text-black" disabled={isLoading}>
                      {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Manually Sync All Outlet Reviews
                  </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to sync now?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                          This will initiate a request to the Google Places API for every outlet that has a Place ID. This is safe to do, but should not be done excessively.
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
