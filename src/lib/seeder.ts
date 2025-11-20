
'use client';

import { collection, writeBatch, getDocs, doc, Firestore, getDoc } from 'firebase/firestore';

const COLLECTIONS_TO_MIGRATE = [
    'blogs', 'menuCategories', 'menuGroups', 'menuItems', 
    'outlets', 'promotions', 'testimonials', 'faq'
];

const FIELDS_TO_TRANSLATE: Record<string, string[]> = {
    blogs: ['title', 'content', 'excerpt'],
    menuCategories: ['name', 'description'],
    menuGroups: ['name'],
    menuItems: ['name', 'description'],
    outlets: ['name', 'address', 'city', 'state', 'hours', 'tagline'],
    promotions: ['title', 'description', 'customDiscountDescription'],
    testimonials: ['name', 'quote'],
    faq: ['question', 'answer'],
};

/**
 * Migrates all documents in specified collections to the new translations schema.
 * @param firestore Firestore instance.
 * @param dryRun If true, logs changes without writing to DB.
 */
export async function migrateAllToTranslations(firestore: Firestore | null, dryRun: boolean): Promise<{ success: boolean, message: string }> {
    if (!firestore) {
        return { success: false, message: 'Firestore is not initialized.' };
    }

    let processedCount = 0;
    let migratedCount = 0;
    const logs: string[] = [];

    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
        const collectionRef = collection(firestore, collectionName);
        const snapshot = await getDocs(collectionRef);
        const batch = writeBatch(firestore);

        for (const docSnap of snapshot.docs) {
            processedCount++;
            const data = docSnap.data();
            
            // Skip if translations object already exists
            if (data.translations) {
                continue;
            }

            const translatableFields = FIELDS_TO_TRANSLATE[collectionName] || [];
            const englishTranslation: Record<string, any> = {};
            const fieldsToRemove: Record<string, any> = {};

            let hasTranslatableField = false;
            for (const field of translatableFields) {
                if (data[field] !== undefined) {
                    englishTranslation[field] = data[field];
                    fieldsToRemove[field] = true; // Mark for removal if you want to clean up top-level fields
                    hasTranslatableField = true;
                }
            }

            if (hasTranslatableField) {
                migratedCount++;
                logs.push(`[${dryRun ? 'DRY-RUN' : 'LIVE'}] Migrating ${collectionName}/${docSnap.id}`);

                if (!dryRun) {
                    const updatePayload: any = {
                        translations: {
                            en: englishTranslation
                        }
                    };
                    // Uncomment the lines below if you want to remove the old top-level fields
                    // for (const field in fieldsToRemove) {
                    //     updatePayload[field] = deleteField();
                    // }
                    batch.set(docSnap.ref, updatePayload, { merge: true });
                }
            }
        }
        if (!dryRun) {
           await batch.commit();
        }
    }
    
    console.log("Migration Logs:\n" + logs.join('\n'));
    return { 
        success: true, 
        message: `Processed ${processedCount} documents. ${migratedCount} documents were ${dryRun ? 'prepared for migration' : 'migrated'}. Check console for details.` 
    };
}


/**
 * A destructive function to clear all documents from managed collections.
 * @param firestore Firestore instance.
 */
export async function clearAllCollections(firestore: Firestore | null): Promise<{ success: boolean, message: string }> {
  if (!firestore) {
    return { success: false, message: 'Firestore is not initialized.' };
  }

  const collectionsToClear = [
    'blogs', 'community_items', 'contactMessages', 'dailySpecials', 'faq',
    'franchiseApplications', 'media', 'menuCategories', 'menuGroups',
    'menuItems', 'newsletterSubscribers', 'outlets', 'promotions',
    'public_insta_feed', 'reviews', 'sync_logs', 'testimonials'
  ];

  let deletedCount = 0;

  try {
    const batch = writeBatch(firestore);
    for (const collectionName of collectionsToClear) {
      const collectionRef = collection(firestore, collectionName);
      const existingSnapshot = await getDocs(collectionRef);
      existingSnapshot.forEach(doc => {
          batch.delete(doc.ref);
          deletedCount++;
      });
    }
    await batch.commit();
    return { success: true, message: `${deletedCount} documents across ${collectionsToClear.length} collections have been deleted.` };
  } catch (error: any) {
    console.error("Error wiping collections: ", error);
    return { success: false, message: `Failed to wipe collections: ${error.message}` };
  }
}
