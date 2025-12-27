'use client';

import { collection, writeBatch, getDocs, doc, Firestore, query } from 'firebase/firestore';
import type { PublicInstaPost } from './types';

async function clearCollections(firestore: Firestore, collectionNames: string[]): Promise<{ success: boolean; message: string }> {
  if (!firestore) {
    return { success: false, message: 'Firestore is not initialized.' };
  }

  let deletedCount = 0;

  try {
    for (const collectionName of collectionNames) {
      const snapshot = await getDocs(collection(firestore, collectionName));
      if (!snapshot.empty) {
        const batch = writeBatch(firestore);
        snapshot.forEach(doc => {
          batch.delete(doc.ref);
          deletedCount++;
        });
        await batch.commit();
      }
    }
    return { success: true, message: `Successfully wiped ${deletedCount} documents from specified collections.` };
  } catch (error: any) {
    console.error("Error wiping collections: ", error);
    return { success: false, message: `Failed to wipe collections: ${error.message}` };
  }
}

export async function clearMenuAndOutlets(firestore: Firestore): Promise<{ success: boolean; message: string }> {
    const collectionsToClear = ['menuItems', 'menuGroups', 'menuCategories', 'outlets'];
    return clearCollections(firestore, collectionsToClear);
}
    
export async function seedSocialMediaPosts(firestore: Firestore, postsData: any[]): Promise<{ success: boolean, count: number, message?: string, error?: string }> {
  if (!firestore) {
    throw new Error('Firestore is not initialized.');
  }

  const socialFeedCollection = collection(firestore, 'public_insta_feed');

  try {
    // 1. Clear existing posts
    const existingDocsSnapshot = await getDocs(socialFeedCollection);
    const deleteBatch = writeBatch(firestore);
    existingDocsSnapshot.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
    
    // 2. Seed new posts
    const seedBatch = writeBatch(firestore);
    let count = 0;

    postsData.forEach((post, index) => {
      const docRef = doc(socialFeedCollection, post.id);
      
      const newPost: PublicInstaPost = {
        id: post.id,
        username: post.username,
        caption: post.caption,
        mediaUrl: post.media.url,
        mediaType: post.media.type.toUpperCase() as 'IMAGE' | 'VIDEO',
        permalink: post.permalink,
        visible: post.visible,
        pinned: post.pinned,
        source: 'manual',
        rank: index + 1, // Simple rank based on order in JSON
        timestamp: new Date().toISOString(),
      };
      
      seedBatch.set(docRef, newPost);
      count++;
    });

    await seedBatch.commit();
    return { success: true, count };
  } catch (error) {
    console.error("Error seeding social media posts: ", error);
    return { success: false, count: 0, error: (error as Error).message };
  }
}
