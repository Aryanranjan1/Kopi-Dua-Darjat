
'use client';

import { collection, writeBatch, getDocs, doc, Firestore, getDoc, deleteField, serverTimestamp, query, where, addDoc } from 'firebase/firestore';

const COLLECTIONS_TO_MIGRATE = [
    'blogs', 'menuCategories', 'menuGroups', 'menuItems', 
    'outlets', 'promotions', 'testimonials', 'faq', 'community_items'
];

const FIELDS_TO_TRANSLATE: Record<string, string[]> = {
    blogs: ['title', 'content', 'excerpt'],
    menuCategories: ['name', 'description'],
    menuGroups: ['name'],
    menuItems: ['name', 'description'],
    outlets: ['name', 'address', 'city', 'state', 'hours', 'tagline'],
    promotions: ['title', 'description', 'customDiscountDescription'],
    testimonials: ['name', 'quote', 'designation'],
    faq: ['question', 'answer'],
    community_items: ['name', 'quote', 'role'],
};

export async function masterSeed(firestore: Firestore | null): Promise<{ success: boolean, message: string }> {
    if (!firestore) {
        return { success: false, message: 'Firestore is not initialized.' };
    }
    
    // In a real application, you would have separate functions to seed each collection
    // with rich, bilingual data. For this example, we will just migrate existing data
    // which serves as a good starting point.
    
    // We will clear all collections first.
    const wipeResult = await clearAllCollections(firestore);
    if (!wipeResult.success) {
        return wipeResult;
    }
    
    // In a real scenario, you would now call individual seeding functions like:
    // await seedBlogs(firestore);
    // await seedOutlets(firestore);
    // etc.
    
    // For now, we will just show a success message.
    // The `seedDemoDataset()` functionality is conceptually what this `masterSeed` does.
    // In a production app, you'd build out full seeding functions for each data type here.
    
    return { success: true, message: "All collections cleared. A full 'seedDemoDataset' function would now populate them with multilingual data." };
}

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
        
        if (snapshot.empty) continue;
        
        const batch = writeBatch(firestore);

        for (const docSnap of snapshot.docs) {
            processedCount++;
            const data = docSnap.data();
            
            if (data.translations) {
                continue;
            }

            const translatableFields = FIELDS_TO_TRANSLATE[collectionName] || [];
            const englishTranslation: Record<string, any> = {};
            const fieldsToDelete: Record<string, any> = {};

            let hasTranslatableField = false;
            for (const field of translatableFields) {
                if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
                    englishTranslation[field] = data[field];
                    fieldsToDelete[field] = deleteField();
                    hasTranslatableField = true;
                }
            }

            if (hasTranslatableField) {
                migratedCount++;
                logs.push(`[${dryRun ? 'DRY-RUN' : 'LIVE'}] Migrating ${collectionName}/${docSnap.id}. Moving fields: ${Object.keys(englishTranslation).join(', ')}`);

                if (!dryRun) {
                    const updatePayload: any = {
                        ...fieldsToDelete,
                        translations: {
                            en: englishTranslation
                        }
                    };
                    batch.update(docSnap.ref, updatePayload);
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
    for (const collectionName of collectionsToClear) {
      const batch = writeBatch(firestore);
      const collectionRef = collection(firestore, collectionName);
      const existingSnapshot = await getDocs(collectionRef);
      if (existingSnapshot.empty) continue;

      existingSnapshot.forEach(doc => {
          batch.delete(doc.ref);
          deletedCount++;
      });
      await batch.commit();
    }
    return { success: true, message: `${deletedCount} documents across ${collectionsToClear.length} collections have been deleted.` };
  } catch (error: any) {
    console.error("Error wiping collections: ", error);
    return { success: false, message: `Failed to wipe collections: ${error.message}` };
  }
}
