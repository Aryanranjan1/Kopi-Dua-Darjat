'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import MediaGrid from './MediaGrid';

// Data from JSON files
import placeholderImagesData from '@/lib/placeholder-images.json';
import { siteContentData } from '@/lib/site-content';

type MediaAsset = {
  id: string;
  url: string;
  type: 'image' | 'video' | 'icon';
  source: 'json' | 'firestore';
  path: string;
};

// Field names that are likely to contain image URLs
const imageKeys = ['imageUrl', 'coverImage', 'heroImage', 'interiorImage', 'logoLight', 'logoDark', 'favicon', 'image', 'photo', 'profile_photo_url', 'bannerImage', 'defaultImage', 'url'];
const videoKeys = ['videoUrl'];

const extractMediaFromObject = (obj: any, path: string = '', source: 'json' | 'firestore'): MediaAsset[] => {
  let assets: MediaAsset[] = [];
  if (!obj || typeof obj !== 'object') return assets;

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const currentPath = path ? `${path}.${key}` : key;
    const value = obj[key];

    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            assets = assets.concat(extractMediaFromObject(item, `${currentPath}[${index}]`, source));
        });
    } else if (typeof value === 'object' && value !== null) {
      assets = assets.concat(extractMediaFromObject(value, currentPath, source));
    } else if (typeof value === 'string' && value.startsWith('http')) {
      const isImageExtension = /\.(jpg|jpeg|png|svg|gif|webp)$/i.test(value);
      const isVideoExtension = /\.(mp4|webm|mov)$/i.test(value);
      const isIconExtension = /\.(ico)$/i.test(value);

      if (imageKeys.includes(key) || isImageExtension || isVideoExtension || isIconExtension) {
        if (currentPath.includes('menuItems')) continue; // Skip menu item images

        let type: MediaAsset['type'] = 'image';
        if (videoKeys.includes(key) || isVideoExtension) type = 'video';
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


export default function MediaAssetManager() {
  const [allMedia, setAllMedia] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const firestore = useFirestore();

  const scanForMedia = useCallback(async () => {
    setIsLoading(true);
    toast({ title: 'Scanning for media...', description: 'Searching your content files and database.' });

    let foundAssets: MediaAsset[] = [];

    // 1. Scan hardcoded JSON/TS files
    foundAssets = foundAssets.concat(extractMediaFromObject(placeholderImagesData, 'placeholder-images.json', 'json'));
    foundAssets = foundAssets.concat(extractMediaFromObject(siteContentData, 'site-content.ts', 'json'));
    
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
    
    const uniqueAssets = Array.from(new Map(foundAssets.map(item => [item.path, item])).values());

    setAllMedia(uniqueAssets);
    setIsLoading(false);
    toast({ title: 'Scan Complete!', description: `Found ${uniqueAssets.length} media assets.` });
  }, [firestore, toast]);

  React.useEffect(() => {
    if(firestore) {
      scanForMedia();
    }
  }, [firestore, scanForMedia]);

  return (
      <MediaGrid 
        assets={allMedia} 
        onUpdate={scanForMedia} 
        isLoading={isLoading}
      />
  );
}
