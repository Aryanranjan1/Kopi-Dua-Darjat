
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
const imageKeys = ['imageUrl', 'coverImage', 'heroImage', 'interiorImage', 'logoLight', 'logoDark', 'favicon', 'image', 'photo', 'profile_photo_url', 'bannerImage', 'defaultImage'];
const videoKeys = ['videoUrl'];

const extractMediaFromObject = (obj: any, path: string = '', source: 'json' | 'firestore'): MediaAsset[] => {
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
          source,
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
            assets = assets.concat(extractMediaFromObject(item, `${currentPath}[${index}]`, source));
        });
    } else if (typeof value === 'object' && value !== null) {
      // Pass the key as the id hint
      const nestedAssets = extractMediaFromObject(value, currentPath, source);
      assets = assets.concat(nestedAssets);

    } else if (typeof value === 'string' && value.startsWith('http')) {
      const isImageExtension = /\.(jpg|jpeg|png|svg|gif|webp)$/i.test(value);
      const isVideoExtension = /\.(mp4|webm|mov)$/i.test(value);
      const isIconExtension = /\.(ico)$/i.test(value);

      if (imageKeys.includes(key) || isImageExtension || isVideoExtension || isIconExtension) {
        // Exclude admin-panel specific images
        if (key === 'photo' && (currentPath.includes('author') || currentPath.includes('founders'))) {
           // continue; // Skip author/founder photos if they are considered internal
        }
        if (currentPath.includes('menuItems')) continue; // Skip individual menu items for clarity

        let type: MediaAsset['type'] = 'image';
        if (videoKeys.includes(key) || isVideoExtension) type = 'video';
        if (isIconExtension) type = 'icon';

        assets.push({
          id: obj.id || key,
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

const groupAssets = (assets: MediaAsset[]): MediaGroup[] => {
    const groups: { [key: string]: MediaAsset[] } = {};

    const getGroupName = (path: string): string => {
        if (path.startsWith('site-content.ts.home')) return 'Homepage';
        if (path.startsWith('site-content.ts.about')) return 'About Page';
        if (path.startsWith('site-content.ts.franchise')) return 'Franchise Page';
        if (path.startsWith('placeholder-images.json')) return 'General & Placeholders';
        if (path.startsWith('blogs')) return 'Blog Posts';
        if (path.startsWith('settings')) return 'Global Site Settings';
        if (path.startsWith('outlets')) return 'Outlets';
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

    // 1. Scan hardcoded TS/JSON files
    try {
        const siteContentPath = path.join(process.cwd(), 'src', 'lib', 'site-content.ts');
        const siteContentFile = await fs.readFile(siteContentPath, 'utf-8');
        const siteContentJsonString = siteContentFile.substring(siteContentFile.indexOf('{'), siteContentFile.lastIndexOf('}') + 1);
        const siteContentData = JSON.parse(siteContentJsonString);
        foundAssets = foundAssets.concat(extractMediaFromObject(siteContentData, 'site-content.ts', 'json'));

        const placeholderImagesPath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');
        const placeholderImagesFile = await fs.readFile(placeholderImagesPath, 'utf-8');
        const placeholderImagesData = JSON.parse(placeholderImagesFile);
        foundAssets = foundAssets.concat(extractMediaFromObject(placeholderImagesData, 'placeholder-images.json', 'json'));

    } catch (fileError) {
        console.warn("Could not scan static content files:", fileError);
    }

    // 2. Scan Firestore database collections
    const { firestore } = initializeServerSideFirebase();
    const collectionsToScan = ['blogs', 'outlets', 'settings'];
    
    for (const collectionName of collectionsToScan) {
        try {
            const snapshot = await getDocs(collection(firestore, collectionName));
            snapshot.forEach(document => {
                foundAssets = foundAssets.concat(extractMediaFromObject(document.data(), `${collectionName}.${document.id}`, 'firestore'));
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
