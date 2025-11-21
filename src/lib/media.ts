
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, setDoc, writeBatch, getDocs, where } from 'firebase/firestore';
import type { Media } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useEffect } from 'react';
import originalMediaData from './placeholder-images.json';

// Function to seed media data from JSON to Firestore
export async function seedMediaData(firestore: any): Promise<{ success: boolean, count: number, error?: string }> {
  if (!firestore) {
    throw new Error('Firestore is not initialized.');
  }
  
  const mediaCollectionRef = collection(firestore, 'media');

  try {
    const existingSnapshot = await getDocs(query(mediaCollectionRef, where('id', 'in', originalMediaData.placeholderImages.map(item => item.id))));
    if (existingSnapshot.docs.length === originalMediaData.placeholderImages.length) {
      // Data seems to be seeded already.
      return { success: true, count: 0, message: "Media data already seems to be seeded." };
    }

    const batch = writeBatch(firestore);
    let count = 0;
    
    originalMediaData.placeholderImages.forEach((mediaItem) => {
      const docRef = doc(mediaCollectionRef, mediaItem.id);
      batch.set(docRef, mediaItem);
      count++;
    });

    await batch.commit();
    return { success: true, count };
  } catch (error) {
    console.error("Error seeding media data: ", error);
    return { success: false, count: 0, error: (error as Error).message };
  }
}


// Hook to get all media assets
export function useMedia() {
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (firestore) {
      seedMediaData(firestore).then(result => {
        if (result.success && result.count > 0) {
          console.log(`Seeded ${result.count} media items.`);
        }
        if (result.error) {
          console.error("Media Seeding Error:", result.error);
        }
      });
    }
  }, [firestore, toast]);
  
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
