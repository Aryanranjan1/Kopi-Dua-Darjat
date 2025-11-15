
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import { collection, getDocs } from 'firebase/firestore';

// --- Type Definitions ---
type MediaAsset = {
  id: string;
  url: string;
  type: 'image' | 'video' | 'icon';
  source: 'json' | 'firestore';
  path: string; // The full path in the original data structure
};

type MediaGroup = {
  group: string;
  assets: MediaAsset[];
};

// --- Media Extraction Logic ---
const imageKeys = ['imageUrl', 'coverImage', 'heroImage', 'interiorImage', 'image', 'photo', 'profile_photo_url', 'bannerImage', 'defaultImageId'];
const videoKeys = ['videoUrl'];

const extractMediaFromObject = (obj: any, path: string = ''): MediaAsset[] => {
  let assets: MediaAsset[] = [];
  if (!obj || typeof obj !== 'object') return assets;

  // Handle case where obj itself is a media object (e.g. coverImage: { url: '...' })
  if (typeof obj.url === 'string' && obj.url.startsWith('http')) {
      const currentPathId = path.split('.').pop() || path;
      if (imageKeys.includes(currentPathId)) {
        assets.push({
          id: obj.id || currentPathId,
          url: obj.url,
          type: 'image',
          source: 'firestore',
          path: path,
        });
        // Stop recursion here if we've found a media object
        return assets;
      }
  }


  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const currentPath = path ? `${path}.${key}` : key;
    const value = obj[key];

    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            assets = assets.concat(extractMediaFromObject(item, `${currentPath}[${index}]`));
        });
    } else if (typeof value === 'object' && value !== null) {
      const nestedAssets = extractMediaFromObject(value, currentPath);
      assets = assets.concat(nestedAssets);

    } else if (typeof value === 'string' && value.startsWith('http')) {
      const isImageExtension = /\.(jpg|jpeg|png|svg|gif|webp)$/i.test(value);
      const isVideoExtension = /\.(mp4|webm|mov)$/i.test(value);
      const isIconExtension = /\.(ico)$/i.test(value);

      if (imageKeys.includes(key) || isImageExtension || isVideoExtension || isIconExtension) {
        if (currentPath.includes('menuItems')) continue;

        let type: MediaAsset['type'] = 'image';
        if (videoKeys.includes(key) || isVideoExtension) type = 'video';
        if (isIconExtension) type = 'icon';

        assets.push({
          id: obj.id || key,
          url: value,
          type: type,
          source: 'firestore',
          path: currentPath,
        });
      }
    }
  }
  return assets;
};

const groupAssets = (assets: MediaAsset[]): MediaGroup[] => {
    const groups: { [key: string]: MediaAsset[] } = {};

    const getGroupName = (path: string): string => {
        if (path.startsWith('settings.main.brand')) return 'Brand & Logos';
        if (path.startsWith('settings.main.founders')) return 'Founders (Global)';
        if (path.startsWith('blogs')) return 'Blog Posts';
        if (path.startsWith('outlets')) return 'Outlets';
        if (path.startsWith('media')) return 'General Media Library';
        return 'Other';
    }

    assets.forEach(asset => {
        const groupName = getGroupName(asset.path);
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(asset);
    });

    return Object.entries(groups)
        .map(([group, assets]) => ({ group, assets }))
        .sort((a,b) => a.group.localeCompare(b.group));
}


// --- Main API Route Handler ---
export async function GET(request: Request) {
  try {
    let foundAssets: MediaAsset[] = [];

    // Scan Firestore database collections
    const { firestore } = initializeServerSideFirebase();
    const collectionsToScan = ['blogs', 'outlets', 'settings', 'media'];
    
    for (const collectionName of collectionsToScan) {
        try {
            const snapshot = await getDocs(collection(firestore, collectionName));
            snapshot.forEach(document => {
                foundAssets = foundAssets.concat(extractMediaFromObject(document.data(), `${collectionName}.${document.id}`));
            });
        } catch (dbError) {
            console.warn(`Could not scan collection '${collectionName}':`, dbError);
        }
    }

    // Remove duplicates based on path
    const uniqueAssets = Array.from(new Map(foundAssets.map(item => [item.path, item])).values());
    
    // Group and sort assets
    const groupedAssets = groupAssets(uniqueAssets);

    return NextResponse.json({ groupedAssets });

  } catch (error) {
    console.error("Failed to scan for media assets:", error);
    return NextResponse.json({ message: "An error occurred while scanning for media." }, { status: 500 });
  }
}
