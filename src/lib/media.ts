
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, setDoc, writeBatch, getDocs, where } from 'firebase/firestore';
import type { Media } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';
import originalMediaData from './placeholder-images.json';

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

// Function to seed media data from JSON to Firestore
export async function seedMediaData(firestore: any): Promise<{ success: boolean, count: number, error?: string }> {
  if (!firestore) {
    throw new Error('Firestore is not initialized.');
  }
  
  const mediaCollectionRef = collection(firestore, 'media');

  try {
    // 1. Delete all existing documents in the collection
    const existingSnapshot = await getDocs(mediaCollectionRef);
    const deleteBatch = writeBatch(firestore);
    existingSnapshot.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
  } catch (error) {
     console.error("Error deleting existing media data: ", error);
     return { success: false, count: 0, error: `Failed to clear existing media: ${(error as Error).message}` };
  }

  // 2. Seed new data
  const seedBatch = writeBatch(firestore);
  let count = 0;
  
  originalMediaData.placeholderImages.forEach((mediaItem) => {
    // We use the ID from the JSON file as the document ID in Firestore
    const docRef = doc(mediaCollectionRef, mediaItem.id);
    seedBatch.set(docRef, mediaItem);
    count++;
  });

  try {
    await seedBatch.commit();
    return { success: true, count };
  } catch (error) {
    console.error("Error seeding media data: ", error);
    return { success: false, count: 0, error: (error as Error).message };
  }
}
