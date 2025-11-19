
'use client';

import { collection, writeBatch, getDocs, doc, Firestore } from 'firebase/firestore';
import { outlets as outletSeedData } from '@/lib/data';
import mediaSeedData from './placeholder-images.json';
import { MenuItem, Outlet } from './types';


// Seeder for Outlets
export async function seedOutlets(firestore: Firestore | null): Promise<{ success: boolean, count: number, error?: string }> {
  if (!firestore) {
    return { success: false, count: 0, error: 'Firestore is not initialized.' };
  }

  const outletsCollectionRef = collection(firestore, 'outlets');
  
  try {
    // 1. Delete all existing documents in the collection
    const existingSnapshot = await getDocs(outletsCollectionRef);
    const deleteBatch = writeBatch(firestore);
    existingSnapshot.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
  } catch (error) {
     return { success: false, count: 0, error: `Failed to clear existing outlets: ${(error as Error).message}` };
  }

  // 2. Seed new data
  const seedBatch = writeBatch(firestore);
  let count = 0;
  
  outletSeedData.forEach(outletData => {
    const docRef = doc(outletsCollectionRef, outletData.slug); // Use slug as document ID
    const cardImage = `https://picsum.photos/seed/${outletData.slug}/600/400`;
    seedBatch.set(docRef, { 
      ...outletData, 
      cardImage: cardImage,
      heroImage: cardImage, // Set heroImage to be same as cardImage
      createdAt: new Date(), 
      updatedAt: new Date() 
    });
    count++;
  });

  try {
    await seedBatch.commit();
    return { success: true, count };
  } catch (error) {
    return { success: false, count: 0, error: (error as Error).message };
  }
}

// Seeder for Media
export async function seedMediaData(firestore: Firestore | null): Promise<{ success: boolean, count: number, error?: string }> {
  if (!firestore) {
    return { success: false, count: 0, error: 'Firestore is not initialized.' };
  }
  
  const mediaCollectionRef = collection(firestore, 'media');

  try {
    // 1. Delete all existing documents
    const existingSnapshot = await getDocs(mediaCollectionRef);
    const deleteBatch = writeBatch(firestore);
    existingSnapshot.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
  } catch (error) {
     return { success: false, count: 0, error: `Failed to clear existing media: ${(error as Error).message}` };
  }

  // 2. Seed new data
  const seedBatch = writeBatch(firestore);
  let count = 0;
  
  mediaSeedData.placeholderImages.forEach((mediaItem) => {
    const docRef = doc(mediaCollectionRef, mediaItem.id);
    seedBatch.set(docRef, mediaItem);
    count++;
  });

  try {
    await seedBatch.commit();
    return { success: true, count };
  } catch (error) {
    return { success: false, count: 0, error: (error as Error).message };
  }
}
