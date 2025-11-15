
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
  path: string;
};

// --- Media Extraction Logic ---
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
        if (currentPath.includes('menuItems')) continue;

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

// --- Main API Route Handler ---
export async function GET(request: Request) {
  try {
    let foundAssets: MediaAsset[] = [];

    // 1. Scan hardcoded TS/JSON files
    try {
        const siteContentPath = path.join(process.cwd(), 'src', 'lib', 'site-content.ts');
        const siteContentFile = await fs.readFile(siteContentPath, 'utf-8');
        // This is a simple parser, might need to be more robust if the file format changes
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
    const collectionsToScan = ['blogs', 'outlets', 'menuCategories', 'promotions', 'settings', 'testimonials', 'community_items'];
    
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
    
    // Sort assets by path
    uniqueAssets.sort((a, b) => a.path.localeCompare(b.path));

    return NextResponse.json({ assets: uniqueAssets });

  } catch (error) {
    console.error("Failed to scan for media assets:", error);
    return NextResponse.json({ message: "An error occurred while scanning for media." }, { status: 500 });
  }
}
