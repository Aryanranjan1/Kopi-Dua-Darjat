
'use client';

import { collection, writeBatch, getDocs, doc, Firestore } from 'firebase/firestore';
import { outlets as outletSeedData } from '@/lib/data';
import mediaSeedData from './placeholder-images.json';
import { siteContentData } from './site-content';

// Define all collections that should be managed by the seeder.
const MANAGED_COLLECTIONS = [
  'blogs',
  'community_items',
  'contactMessages',
  'dailySpecials',
  'faq',
  'franchiseApplications',
  'media',
  'menuCategories',
  'menuGroups',
  'menuItems',
  'newsletterSubscribers',
  'outlets',
  'promotions',
  'public_insta_feed',
  'reviews',
  'sync_logs',
  'testimonials'
];

/**
 * A master seeder function to wipe and re-seed all managed collections.
 * This is a destructive operation.
 */
export async function masterSeed(firestore: Firestore | null): Promise<{ success: boolean, message: string }> {
  if (!firestore) {
    return { success: false, message: 'Firestore is not initialized.' };
  }

  // --- WIPE PHASE ---
  try {
    const deleteBatch = writeBatch(firestore);
    for (const collectionName of MANAGED_COLLECTIONS) {
      const collectionRef = collection(firestore, collectionName);
      const existingSnapshot = await getDocs(collectionRef);
      existingSnapshot.forEach(doc => deleteBatch.delete(doc.ref));
    }
    await deleteBatch.commit();
  } catch (error: any) {
    console.error("Error wiping collections: ", error);
    return { success: false, message: `Failed to wipe collections: ${error.message}` };
  }

  // --- SEED PHASE ---
  const seedBatch = writeBatch(firestore);
  let seededCount = 0;

  try {
    // Seed Outlets
    outletSeedData.forEach(outletData => {
      const docRef = doc(collection(firestore, 'outlets'), outletData.slug);
      const cardImage = `https://picsum.photos/seed/${outletData.slug}/600/400`;
      seedBatch.set(docRef, { 
        ...outletData, 
        cardImage: cardImage,
        heroImage: cardImage,
        createdAt: new Date(), 
        updatedAt: new Date() 
      });
      seededCount++;
    });

    // Seed Media
    mediaSeedData.placeholderImages.forEach((mediaItem) => {
      const docRef = doc(collection(firestore, 'media'), mediaItem.id);
      seedBatch.set(docRef, mediaItem);
      seededCount++;
    });
    
    // Seed Site Settings (as a baseline)
    const settingsRef = doc(firestore, 'settings', 'main');
    seedBatch.set(settingsRef, siteContentData, { merge: true }); // Use merge to not overwrite sensitive keys if they exist
    seededCount++;

    await seedBatch.commit();
    return { success: true, message: `${seededCount} total documents were seeded across all collections.` };

  } catch (error: any) {
    console.error("Error seeding data: ", error);
    return { success: false, message: `Failed to seed data: ${error.message}` };
  }
}
