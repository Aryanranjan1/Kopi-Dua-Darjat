
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, setDoc, writeBatch, getDocs, where, DocumentData, QuerySnapshot } from 'firebase/firestore';
import type { Media } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useEffect } from 'react';

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
