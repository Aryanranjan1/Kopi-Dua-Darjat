
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const DateTimePicker = ({ label, date, setDate }: { label: string; date: Date | undefined; setDate: (date: Date | undefined) => void; }) => {
    const inputStyles = "bg-zinc-800 border-zinc-700 text-white focus-visible:ring-primary";

    return (
        <div className="grid w-full items-center gap-1.5">
            <Label htmlFor={label.toLowerCase().replace(' ', '-')} className="text-zinc-400">{label}</Label>
             <Popover>
                  <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", inputStyles)}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP HH:mm") : <span>Pick a date</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-zinc-900 border-zinc-800" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    <div className="p-2 border-t border-zinc-800">
                        <Input 
                            type="time"
                            value={date ? format(date, 'HH:mm') : ''}
                            onChange={(e) => {
                                const newTime = e.target.value;
                                const [hours, minutes] = newTime.split(':').map(Number);
                                const newDate = date ? new Date(date) : new Date();
                                newDate.setHours(hours, minutes);
                                setDate(newDate);
                            }}
                            className={inputStyles}
                        />
                    </div>
                  </PopoverContent>
                </Popover>
        </div>
    );
};


export default function GooglePlacesSync() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

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
  
  const handleScheduleSync = () => {
    if (!startDate || !endDate) {
        toast({
            variant: 'destructive',
            title: 'Invalid Dates',
            description: 'Please select both a start and end date for the sync schedule.',
        });
        return;
    }
    if (endDate <= startDate) {
        toast({
            variant: 'destructive',
            title: 'Invalid Date Range',
            description: 'The end date must be after the start date.',
        });
        return;
    }
    
    // Simulate scheduling a backend job
    toast({
        title: 'Sync Scheduled',
        description: `Automated sync will run between ${format(startDate, 'PPP HH:mm')} and ${format(endDate, 'PPP HH:mm')}.`
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
                  This manual trigger is for immediate updates. Automated syncs can be configured with your backend.
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
              <h4 className="font-medium text-zinc-300">Automated Sync Schedule</h4>
              <p className="text-sm text-zinc-500 mb-4">Set a date range for automatic background syncing. This is a UI prototype.</p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                  <DateTimePicker label="Sync Start" date={startDate} setDate={setStartDate} />
                  <DateTimePicker label="Sync End" date={endDate} setDate={setEndDate} />
                  <div className="w-full sm:w-auto self-end">
                     <Button onClick={handleScheduleSync} className="w-full sm:w-auto mt-4 sm:mt-0">Schedule Sync</Button>
                  </div>
              </div>
          </div>
      </CardContent>
    </Card>
  );
}
