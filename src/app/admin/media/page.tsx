'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, RefreshCw, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import MediaGrid from './(components)/MediaGrid';

// Data from JSON files
import placeholderImagesData from '@/lib/placeholder-images.json';
import { outlets as hardcodedOutlets } from '@/lib/data';


type MediaAsset = {
  id: string;
  url: string;
  type: 'image' | 'video' | 'icon';
  source: 'json' | 'firestore';
  path: string;
};

// Field names that are likely to contain image URLs
const imageKeys = ['imageUrl', 'coverImage', 'heroImage', 'interiorImage', 'logoLight', 'logoDark', 'favicon', 'image', 'photo', 'profile_photo_url', 'bannerImage', 'defaultImage'];

const extractMediaFromObject = (obj: any, path: string = '', source: 'json' | 'firestore'): MediaAsset[] => {
  let assets: MediaAsset[] = [];
  if (!obj) return assets;

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const currentPath = path ? `${path}.${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null) {
      assets = assets.concat(extractMediaFromObject(value, currentPath, source));
    } else if (typeof value === 'string' && value.startsWith('http')) {
      const isImageExtension = /\.(jpg|jpeg|png|svg|gif|webp)$/i.test(value);
      const isVideoExtension = /\.(mp4|webm|mov)$/i.test(value);
      const isIconExtension = /\.(ico)$/i.test(value);

      if (imageKeys.includes(key) || isImageExtension || isVideoExtension || isIconExtension) {
        if (currentPath.includes('menuItems')) continue; // Skip menu item images as requested

        let type: MediaAsset['type'] = 'image';
        if (isVideoExtension) type = 'video';
        if (isIconExtension) type = 'icon';

        assets.push({
          id: currentPath,
          url: value,
          type: type,
          source,
          path: currentPath,
        });
      }
    }
  }
  return assets;
};


export default function MediaPage() {
  const [allMedia, setAllMedia] = useState<MediaAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const firestore = useFirestore();

  const scanForMedia = useCallback(async () => {
    setIsLoading(true);
    toast({ title: 'Scanning for media...', description: 'Searching your content files and database.' });

    let foundAssets: MediaAsset[] = [];

    // 1. Scan hardcoded JSON files
    foundAssets = foundAssets.concat(extractMediaFromObject(placeholderImagesData, 'placeholderImages.json', 'json'));
    foundAssets = foundAssets.concat(extractMediaFromObject({hardcodedOutlets}, 'data.ts', 'json'));

    // 2. Scan Firestore database collections
    if (firestore) {
      const collectionsToScan = ['blogs', 'outlets', 'menuCategories', 'promotions', 'settings', 'testimonials'];
      try {
        for (const collectionName of collectionsToScan) {
          const snapshot = await getDocs(collection(firestore, collectionName));
          snapshot.forEach(document => {
            foundAssets = foundAssets.concat(extractMediaFromObject(document.data(), `${collectionName}.${document.id}`, 'firestore'));
          });
        }
      } catch (error) {
        console.error("Error fetching Firestore media:", error);
        toast({ variant: 'destructive', title: 'Firestore Error', description: 'Could not scan database for media.' });
      }
    }
    
    // Remove duplicates based on a unique key (path)
    const uniqueAssets = Array.from(new Map(foundAssets.map(item => [item.path, item])).values());

    setAllMedia(uniqueAssets);
    setIsLoading(false);
    toast({ title: 'Scan Complete!', description: `Found ${uniqueAssets.length} media assets.` });
  }, [firestore, toast]);

  // Initial scan on component mount
  React.useEffect(() => {
    if(firestore) {
      scanForMedia();
    }
  }, [firestore, scanForMedia]);

  const filteredMedia = React.useMemo(() => {
    if (!searchQuery) return allMedia;
    return allMedia.filter(item => 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allMedia, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold text-white flex items-center gap-2">
              <ImageIcon /> Media Library
            </h1>
            <p className="text-zinc-400 mt-1">
                Scan, view, and manage all visual assets used across your website.
            </p>
        </div>
         <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input 
                    placeholder="Search by ID or URL..."
                    className="pl-9 bg-zinc-800 border-zinc-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button onClick={scanForMedia} disabled={isLoading} variant="outline" className="bg-zinc-800 border-zinc-700">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4" />}
                Refresh
            </Button>
        </div>
      </div>
      
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Found Media</CardTitle>
          <CardDescription>{isLoading ? "Scanning..." : `${filteredMedia.length} assets found.`}</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <MediaGrid assets={filteredMedia} onUpdate={scanForMedia} />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
