
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Search, Check, Copy, Link as LinkIcon } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// In a real scenario, this would be a server action to update a Firestore document.
// For this MVP, we are demonstrating the concept with a client-side action.
// This function would need to be replaced with a server action.
async function updateImageUrl(id: string, newUrl: string) {
    // This is a placeholder. A real implementation would:
    // 1. Be a server action.
    // 2. Call `updateDoc` on the `/media/{id}` document in Firestore.
    // 3. The frontend would automatically update due to the real-time listener.
    console.log(`Request to update media item '${id}' with new URL: ${newUrl}`);
    // In this demo, we can't modify the server's file system, so we'll simulate the success.
    return { success: true };
}


function MediaItemCard({ item }: { item: typeof PlaceHolderImages[0] }) {
  const [newUrl, setNewUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    if (!newUrl || !newUrl.startsWith('http')) {
        toast({
            variant: 'destructive',
            title: 'Invalid URL',
            description: 'Please enter a valid, full URL starting with http.',
        });
        return;
    }
    setIsLoading(true);
    const result = await updateImageUrl(item.id, newUrl);
    setIsLoading(false);

    if (result.success) {
        toast({
            title: 'Update Simulated',
            description: `The URL for "${item.id}" would now be updated. Refresh the live site to see changes if this were fully implemented.`,
        });
        // In a real app with Firestore, we wouldn't need to manually update state.
        // The `useCollection` hook would handle it.
    } else {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not update the image URL.',
        });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to Clipboard', description: `${label}: ${text}`});
  }

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 text-white flex flex-col">
        <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span className="truncate">{item.id}</span>
                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(item.id, 'ID')}>
                    <Copy className="w-4 h-4" />
                </Button>
            </CardTitle>
            <CardDescription className="text-zinc-400 text-xs truncate h-4">{item.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
            <div className="relative aspect-video rounded-md overflow-hidden bg-zinc-800">
                <Image src={item.imageUrl} alt={item.description} fill className="object-cover"/>
            </div>
            <div className="mt-4">
                <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-zinc-500"/>
                    <p className="text-xs text-zinc-400 truncate">
                        Current URL: {item.imageUrl}
                    </p>
                    <Button size="icon" variant="ghost" onClick={() => copyToClipboard(item.imageUrl, 'URL')}>
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="mt-auto pt-4">
                <p className="text-sm font-medium mb-2">Replace Image URL</p>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Paste new image URL..."
                        className="bg-zinc-800 border-zinc-700"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                    />
                    <Button onClick={handleUpdate} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                        <Check className="w-4 h-4"/>
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}


export default function MediaPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredMedia = React.useMemo(() => {
    if (!searchQuery) return PlaceHolderImages;
    return PlaceHolderImages.filter(item => 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold text-white">Media Library</h1>
            <p className="text-zinc-400 mt-1">
                View and manage all visual assets used across the website.
            </p>
        </div>
        <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
                placeholder="Search by ID or description..."
                className="pl-9 bg-zinc-800 border-zinc-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map(item => (
            <MediaItemCard key={item.id} item={item} />
        ))}
         {filteredMedia.length === 0 && (
            <p className="text-zinc-500 col-span-full text-center py-16">No media assets found for your search.</p>
         )}
      </div>

       <Card className="bg-blue-900/20 border-blue-500/30 text-blue-200">
        <CardHeader>
            <CardTitle className="text-blue-100">Developer Note: MVP Implementation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
           <p>This is a foundational version of the Media Library.</p>
           <ul className="list-disc pl-5 space-y-1">
            <li>Currently, this page reads from the static <code className="bg-black/50 px-1 py-0.5 rounded">placeholder-images.json</code> file.</li>
            <li>The "Update" functionality is simulated. In a full implementation, this would be a server action that updates a Firestore document.</li>
            <li>The next step is to migrate this data to a `/media` collection in Firestore and have components fetch URLs dynamically. This will enable live updates without needing a page refresh.</li>
           </ul>
        </CardContent>
       </Card>
    </div>
  );
}
