
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, setDoc, writeBatch, getDocs, where, DocumentData, QuerySnapshot } from 'firebase/firestore';
import type { Media } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useEffect } from 'react';
import originalMediaData from './placeholder-images.json';

// Function to seed media data from JSON to Firestore
export async function seedMediaData(firestore: any): Promise<{ success: boolean, count: number, message?: string, error?: string }> {
  if (!firestore) {
    throw new Error('Firestore is not initialized.');
  }
  
  const mediaCollectionRef = collection(firestore, 'media');
  const allItemIds = originalMediaData.placeholderImages.map(item => item.id);

  try {
    // Batch the check for existing documents to avoid the 30-item 'in' query limit
    const existingIds = new Set<string>();
    const idChunks: string[][] = [];
    for (let i = 0; i < allItemIds.length; i += 30) {
      idChunks.push(allItemIds.slice(i, i + 30));
    }

    const checkPromises = idChunks.map(chunk => 
      getDocs(query(mediaCollectionRef, where('__name__', 'in', chunk)))
    );

    const snapshots = await Promise.all(checkPromises);
    snapshots.forEach(snapshot => {
      snapshot.forEach(doc => {
        existingIds.add(doc.id);
      });
    });

    const itemsToSeed = originalMediaData.placeholderImages.filter(item => !existingIds.has(item.id));
    
    if (itemsToSeed.length === 0) {
      return { success: true, count: 0, message: "All media assets from JSON already exist in Firestore." };
    }

    const batch = writeBatch(firestore);
    let count = 0;
    
    itemsToSeed.forEach((mediaItem) => {
      const docRef = doc(mediaCollectionRef, mediaItem.id);
      batch.set(docRef, mediaItem);
      count++;
    });

    await batch.commit();
    return { success: true, count, message: `Successfully seeded ${count} new media items.` };
  } catch (error) {
    console.error("Error seeding media data: ", error);
    return { success: false, count: 0, error: (error as Error).message };
  }
}


// Hook to get all media assets
export function useMedia() {
  const firestore = useFirestore();
  
  const mediaQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'media')) : null),
    [firestore]
  );
  return useCollection<Media>(mediaQuery);
}

// Hook to get a single media asset by its ID
export function useMediaAsset(id: string) {
  const { data: media, isLoading, error } = useMedia();
  const asset = useMemo(() => media?.find(item => item.id === id), [media, id]);
  return { asset, isLoading, error };
}

// Function to update a media asset's URL
export async function updateMediaUrl(firestore: any, id: string, newUrl: string) {
  if (!firestore) {
    throw new Error('Firestore is not initialized.');
  }
  const mediaDocRef = doc(firestore, 'media', id);
  try {
    await setDoc(mediaDocRef, { imageUrl: newUrl }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating media URL: ", error);
    return { success: false, error: (error as Error).message };
  }
}
