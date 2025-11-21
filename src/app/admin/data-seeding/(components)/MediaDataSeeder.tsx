'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { seedMediaData } from '@/lib/media';

export default function MediaDataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedMedia = async () => {
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive'});
        return;
    }
    setIsSeeding(true);
    toast({ title: 'Media Seed Initiated...', description: 'Populating the media collection from the JSON file.', duration: 5000 });
    
    const result = await seedMediaData(firestore);
    
    if (result.success) {
      if (result.count > 0) {
        toast({ title: 'Success!', description: `Seeded ${result.count} media assets into Firestore.`, duration: 5000 });
      } else {
        toast({ title: 'No action needed.', description: result.message || 'Media assets are already up to date.', duration: 5000 });
      }
    } else {
      toast({ variant: 'destructive', title: 'Media Seed Failed', description: result.error, duration: 8000 });
      console.error("Media Seed Error:", result.error);
    }
    setIsSeeding(false);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ImageIcon /> Media Asset Seeder</CardTitle>
        <CardDescription className="text-zinc-400">
          Populate the 'media' collection in Firestore with the data from `src/lib/placeholder-images.json`. This is a non-destructive action and will only add missing items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSeedMedia} className="w-full" disabled={isSeeding}>
            {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
            Seed Media Assets
        </Button>
      </CardContent>
    </Card>
  );
}
