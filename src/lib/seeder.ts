
'use client';

import { collection, writeBatch, getDocs, doc, Firestore, getDoc, deleteField, serverTimestamp, query, where, addDoc } from 'firebase/firestore';
import { siteContentData } from './site-content';
import { Blog, CommunityItem, FaqItem, Media, MenuCategory, MenuGroup, MenuItem, Outlet, Promotion, Testimonial } from './types';

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
                        },
                        updatedAt: serverTimestamp(),
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

async function seedCollection<T>(firestore: Firestore, collectionName: string, data: T[], idField: keyof T) {
    const batch = writeBatch(firestore);
    const collectionRef = collection(firestore, collectionName);

    // Check if collection is empty
    const snapshot = await getDocs(query(collectionRef, where('__name__', '!=', '')));
    if (!snapshot.empty) {
        console.log(`Collection '${collectionName}' is not empty. Skipping seed.`);
        return 0; // Skip seeding if not empty
    }
    
    data.forEach((item: any) => {
        const docId = item[idField];
        const docRef = doc(collectionRef, docId);
        batch.set(docRef, { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    });
    await batch.commit();
    return data.length;
}

export async function masterSeed(firestore: Firestore | null): Promise<{ success: boolean, message: string }> {
    if (!firestore) {
        return { success: false, message: 'Firestore is not initialized.' };
    }

    const wipeResult = await clearAllCollections(firestore);
    if (!wipeResult.success) {
        return wipeResult;
    }

    const seedResult = await seedDemoDataset(firestore);
    if (!seedResult.success) {
        return seedResult;
    }

    return { success: true, message: `Database wiped and seeded with ${seedResult.message}` };
}


export async function seedDemoDataset(firestore: Firestore): Promise<{ success: boolean; message: string }> {
    if (!firestore) {
      return { success: false, message: 'Firestore not available.' };
    }
  
    try {
      const batch = writeBatch(firestore);
      let totalCount = 0;
  
      // Helper to check if a collection is empty before seeding
      const isCollectionEmpty = async (name: string) => {
        const snapshot = await getDocs(query(collection(firestore, name), where('__name__', '!=', '')));
        return snapshot.empty;
      };
  
      // --- Seed Logic ---
      const menuGroupsData: Omit<MenuGroup, 'id' | 'createdAt' | 'updatedAt'>[] = [
        { displayOrder: 1, slug: 'kopi-series', status: 'published', translations: { en: { name: 'Kopi Series' }, ms: { name: 'Siri Kopi' } }},
        { displayOrder: 2, slug: 'non-kopi', status: 'published', translations: { en: { name: 'Non-Kopi' }, ms: { name: 'Bukan Kopi' } }},
        { displayOrder: 3, slug: 'menet', status: 'published', translations: { en: { name: 'Menet Series' }, ms: { name: 'Siri Menet' } }},
      ];
      if (await isCollectionEmpty('menuGroups')) {
        menuGroupsData.forEach(item => {
            const docRef = doc(collection(firestore, 'menuGroups'));
            batch.set(docRef, item);
            totalCount++;
        })
      }
      
      const outletsData: Partial<Outlet>[] = [
         {
            slug: "kopi-kl-sentral",
            lat: 3.134,
            lng: 101.686,
            status: "active",
            translations: {
                en: { name: "Kopi Dua Darjat - KL Sentral", address: "1, Jalan Stesen Sentral, Kuala Lumpur Sentral, 50470 Kuala Lumpur", city: "Kuala Lumpur", state: "Kuala Lumpur", hours: "7 AM - 9 PM", tagline: "Your daily brew stop at the heart of the city." },
                ms: { name: "Kopi Dua Darjat - KL Sentral", address: "1, Jalan Stesen Sentral, Kuala Lumpur Sentral, 50470 Kuala Lumpur", city: "Kuala Lumpur", state: "Kuala Lumpur", hours: "7 PG - 9 MLM", tagline: "Hentian kopi harian anda di nadi kota." }
            }
        },
        {
            slug: "kopi-bangsar-village",
            lat: 3.129,
            lng: 101.671,
            status: "active",
            translations: {
                en: { name: "Kopi Dua Darjat - Bangsar Village", address: "1, Jalan Telawi 1, Bangsar, 59100 Kuala Lumpur", city: "Kuala Lumpur", state: "Kuala Lumpur", hours: "8 AM - 10 PM", tagline: "The perfect spot for your coffee fix in Bangsar." },
                ms: { name: "Kopi Dua Darjat - Bangsar Village", address: "1, Jalan Telawi 1, Bangsar, 59100 Kuala Lumpur", city: "Kuala Lumpur", state: "Kuala Lumpur", hours: "8 PG - 10 MLM", tagline: "Tempat terbaik untuk kopi anda di Bangsar." }
            }
        },
      ];
       if (await isCollectionEmpty('outlets')) {
        outletsData.forEach(item => {
            const docRef = doc(firestore, 'outlets', item.slug!);
            batch.set(docRef, item);
            totalCount++;
        })
      }
  
      await batch.commit();
      return { success: true, message: `Successfully seeded ${totalCount} documents.` };
  
    } catch (error: any) {
      console.error("Error seeding demo data:", error);
      return { success: false, message: `Seeding failed: ${error.message}` };
    }
}
