
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Search, Check, Copy, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useMedia, updateMediaUrl } from '@/lib/media';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import type { Media } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function MediaItemCard({ item }: { item: Media }) {
  const [newUrl, setNewUrl] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleUpdate = async () => {
    if (!newUrl || !newUrl.startsWith('http')) {
        toast({
            variant: 'destructive',
            title: 'Invalid URL',
            description: 'Please enter a valid, full URL starting with http.',
        });
        return;
    }
    setIsUpdating(true);
    const result = await updateMediaUrl(firestore, item.id, newUrl);
    setIsUpdating(false);

    if (result.success) {
        toast({
            title: 'Update Successful',
            description: `The URL for "${item.id}" has been updated. The live site will now reflect this change.`,
        });
        setNewUrl(''); // Clear input on success
    } else {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: result.error || 'Could not update the image URL.',
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
                    <Button onClick={handleUpdate} disabled={isUpdating} className="bg-emerald-600 hover:bg-emerald-700">
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}


export default function MediaPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: media, isLoading } = useMedia();

  const filteredMedia = React.useMemo(() => {
    if (!media) return [];
    if (!searchQuery) return media;
    return media.filter(item => 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [media, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold text-white flex items-center gap-2">
              <ImageIcon /> Media Library
            </h1>
            <p className="text-zinc-400 mt-1">
                View and manage all visual assets used across the website. Changes here will reflect live on the site.
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
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-96 bg-zinc-800" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map(item => (
              <MediaItemCard key={item.id} item={item} />
          ))}
          {filteredMedia.length === 0 && (
              <p className="text-zinc-500 col-span-full text-center py-16">No media assets found for your search.</p>
          )}
        </div>
      )}
    </div>
  );
}
