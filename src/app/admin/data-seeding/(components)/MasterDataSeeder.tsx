
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { seedOutlets, seedMediaData } from '@/lib/seeder';

export default function MasterDataSeeder() {
  const [isSeedingOutlets, setIsSeedingOutlets] = useState(false);
  const [isSeedingMedia, setIsSeedingMedia] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedOutlets = async () => {
    setIsSeedingOutlets(true);
    toast({ title: 'Seeding Outlets...', description: 'This may take a moment. Please do not navigate away.' });
    const result = await seedOutlets(firestore);
    if (result.success) {
      toast({ title: 'Success!', description: `${result.count} outlets were seeded.` });
    } else {
      toast({ variant: 'destructive', title: 'Outlet Seeding Failed', description: result.error });
    }
    setIsSeedingOutlets(false);
  };

  const handleSeedMedia = async () => {
    setIsSeedingMedia(true);
    toast({ title: 'Seeding Media...', description: 'Populating the media library.' });
    const result = await seedMediaData(firestore);
    if (result.success) {
      toast({ title: 'Success!', description: `${result.count} media assets were seeded.` });
    } else {
      toast({ variant: 'destructive', title: 'Media Seeding Failed', description: result.error });
    }
    setIsSeedingMedia(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database /> Outlet Data Seeder</CardTitle>
                <CardDescription className="text-zinc-400">
                Deletes all existing outlets and re-populates the collection with 50 standardized sample outlets.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
                    <div>
                        <h3 className="font-semibold text-destructive">Warning: Destructive Action</h3>
                        <p className="text-sm text-destructive/80">
                        This will permanently delete all current documents in your 'outlets' collection before seeding new data. This action cannot be undone.
                        </p>
                    </div>
                </div>
                <Button onClick={handleSeedOutlets} variant="destructive" className="mt-6 w-full" disabled={isSeedingOutlets}>
                    {isSeedingOutlets ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                    Delete All & Re-Seed Outlets
                </Button>
            </CardContent>
        </Card>
        
         <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon /> Media Library Seeder</CardTitle>
                <CardDescription className="text-zinc-400">
                    Populates the 'media' collection from the placeholder JSON file, making images manageable in the CMS.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4 rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
                    <AlertTriangle className="h-6 w-6 text-blue-400 mt-1" />
                    <div>
                        <h3 className="font-semibold text-blue-300">Note: Destructive Action</h3>
                        <p className="text-sm text-blue-400/80">
                         This tool will first delete all existing items in your media library before seeding it with the default images.
                        </p>
                    </div>
                </div>
                <Button onClick={handleSeedMedia} variant="outline" className="mt-6 w-full" disabled={isSeedingMedia}>
                    {isSeedingMedia ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                    Seed Media Library
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
