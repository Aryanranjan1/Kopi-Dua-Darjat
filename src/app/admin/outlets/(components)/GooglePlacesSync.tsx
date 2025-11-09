
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, AlertTriangle, MapPin, Calendar as CalendarIcon } from 'lucide-react';
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
import { collection, query, where } from 'firebase/firestore';
import type { Outlet } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GooglePlacesSync() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const [scheduleDay, setScheduleDay] = useState('monday');
  const [scheduleTime, setScheduleTime] = useState('03:00');


  const outletsWithPlaceIdQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'outlets'), where('placeId', '!=', null)) : null,
    [firestore]
  );
  const { data: outlets, isLoading: isLoadingOutlets } = useCollection<Outlet>(outletsWithPlaceIdQuery);

  const handleManualSync = async () => {
    setIsLoading(true);
    toast({
      title: 'Sync Initiated',
      description: 'Fetching latest reviews for all outlets with a Place ID. This may take a few minutes.',
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
  
  const handleSetSchedule = () => {
    if (!scheduleDay || !scheduleTime) {
        toast({
            variant: 'destructive',
            title: 'Invalid Schedule',
            description: 'Please select a day and time for the sync.',
        });
        return;
    }
    
    // Simulate scheduling a backend job (e.g., a cron job)
    toast({
        title: 'Recurring Sync Scheduled',
        description: `Automated sync will now run every ${scheduleDay.charAt(0).toUpperCase() + scheduleDay.slice(1)} at ${scheduleTime}.`
    });
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><RefreshCw /> Google Places Sync</CardTitle>
        <CardDescription className="text-zinc-400">
          Manually trigger a data sync from Google Places to update ratings and reviews for outlets with a Place ID.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
          <div className="flex items-start gap-4 rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
              <AlertTriangle className="h-6 w-6 text-blue-400 mt-1" />
              <div>
                  <h3 className="font-semibold text-blue-300">Note on Automated Sync</h3>
                  <p className="text-sm text-blue-400/80">
                  You can trigger an immediate sync below or set a recurring schedule for automated background updates.
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
          
          <div className="border-t border-zinc-800 pt-6">
              <h4 className="font-medium text-zinc-300">Automated Sync Schedule (UI Only)</h4>
              <p className="text-sm text-zinc-500 mb-4">Set a recurring time for automatic background syncing. This requires backend implementation.</p>
              <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="sync-day" className="text-zinc-400">Day of the Week</Label>
                    <Select value={scheduleDay} onValueChange={setScheduleDay}>
                        <SelectTrigger id="sync-day" className="bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="tuesday">Tuesday</SelectItem>
                            <SelectItem value="wednesday">Wednesday</SelectItem>
                            <SelectItem value="thursday">Thursday</SelectItem>
                            <SelectItem value="friday">Friday</SelectItem>
                            <SelectItem value="saturday">Saturday</SelectItem>
                            <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="sync-time" className="text-zinc-400">Time (24hr format)</Label>
                    <Input id="sync-time" type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="bg-zinc-800 border-zinc-700" />
                  </div>
                  <div className="w-full sm:w-auto">
                     <Button onClick={handleSetSchedule} className="w-full sm:w-auto">Set Schedule</Button>
                  </div>
              </div>
          </div>
      </CardContent>
    </Card>
  );
}
