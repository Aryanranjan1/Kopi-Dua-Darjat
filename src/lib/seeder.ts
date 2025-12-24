
'use client';

import { collection, writeBatch, getDocs, doc, Firestore, query } from 'firebase/firestore';

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
    

    