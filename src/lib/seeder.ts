
'use client';

import { collection, writeBatch, getDocs, doc, Firestore, getDoc, deleteField, serverTimestamp, query, where, addDoc, limit } from 'firebase/firestore';
import { siteContentData } from './site-content';
import { Blog, CommunityItem, FaqItem, Media, MenuCategory, MenuGroup, MenuItem, Outlet, Promotion, Testimonial, ReviewDocument, Review } from './types';
import originalMediaData from './placeholder-images.json';


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
                logs.push(`[SKIPPED] ${collectionName}/${docSnap.id} already has a 'translations' field.`);
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
        if (!dryRun && batch.size > 0) {
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
        const q = query(collection(firestore, name), limit(1));
        const snapshot = await getDocs(q);
        return snapshot.empty;
      };
  
      // --- Seed Logic ---
      if (await isCollectionEmpty('menuGroups')) {
        const menuGroupsData: Omit<MenuGroup, 'id' | 'createdAt' | 'updatedAt'>[] = [
            { displayOrder: 1, slug: 'kopi-series', status: 'published', translations: { en: { name: 'Kopi Series' }, ms: { name: 'Siri Kopi' } }},
            { displayOrder: 2, slug: 'non-kopi', status: 'published', translations: { en: { name: 'Non-Kopi' }, ms: { name: 'Bukan Kopi' } }},
            { displayOrder: 3, slug: 'menet', status: 'published', translations: { en: { name: 'Menet Series' }, ms: { name: 'Siri Menet' } }},
        ];
        menuGroupsData.forEach(item => {
            const docRef = doc(collection(firestore, 'menuGroups'));
            batch.set(docRef, item);
            totalCount++;
        })
      }
      
       if (await isCollectionEmpty('outlets')) {
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
        outletsData.forEach(item => {
            const docRef = doc(firestore, 'outlets', item.slug!);
            batch.set(docRef, item);
            totalCount++;
        })
      }

      if (await isCollectionEmpty('media')) {
         originalMediaData.placeholderImages.forEach((mediaItem) => {
            const docRef = doc(collection(firestore, 'media'), mediaItem.id);
            batch.set(docRef, mediaItem);
            totalCount++;
        });
      }
  
      await batch.commit();
      return { success: true, message: `Successfully seeded ${totalCount} documents into empty collections.` };
  
    } catch (error: any) {
      console.error("Error seeding demo data:", error);
      return { success: false, message: `Seeding failed: ${error.message}` };
    }
}


export async function seedMenuData(firestore: Firestore): Promise<{ success: boolean; message: string }> {
  const batch = writeBatch(firestore);
  const collectionsToWipe = ['menuItems', 'menuCategories', 'menuGroups'];
  let deletedCount = 0;
  let createdCount = 0;

  try {
    for (const collectionName of collectionsToWipe) {
      const snapshot = await getDocs(collection(firestore, collectionName));
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
        deletedCount++;
      });
    }
  } catch (error: any) {
    return { success: false, message: `Failed to wipe existing menu data: ${error.message}` };
  }

  try {
    const outletsSnapshot = await getDocs(collection(firestore, 'outlets'));
    const allOutletIds = outletsSnapshot.docs.map(doc => doc.id);

    const groups = [
        { id: 'kopi-series', displayOrder: 1, slug: 'kopi-series', status: 'published', translations: { en: { name: 'Kopi Series' }, ms: { name: 'Siri Kopi' } } },
        { id: 'non-kopi', displayOrder: 2, slug: 'non-kopi', status: 'published', translations: { en: { name: 'Non-Kopi' }, ms: { name: 'Bukan Kopi' } } },
        { id: 'menet-series', displayOrder: 3, slug: 'menet-series', status: 'published', translations: { en: { name: 'Menet Series' }, ms: { name: 'Siri Menet' } } }
    ];

    const categories = [
        { id: 'darjat', groupId: 'kopi-series', displayOrder: 1, slug: 'darjat', translations: { en: { name: 'Darjat' }, ms: { name: 'Darjat' } } },
        { id: 'asli', groupId: 'kopi-series', displayOrder: 2, slug: 'asli', translations: { en: { name: 'Asli' }, ms: { name: 'Asli' } } },
        { id: 'susu', groupId: 'non-kopi', displayOrder: 1, slug: 'susu', translations: { en: { name: 'Susu' }, ms: { name: 'Susu' } } },
        { id: 'coklat', groupId: 'non-kopi', displayOrder: 2, slug: 'coklat', translations: { en: { name: 'Coklat' }, ms: { name: 'Coklat' } } },
        { id: 'teh', groupId: 'non-kopi', displayOrder: 3, slug: 'teh', translations: { en: { name: 'Teh' }, ms: { name: 'Teh' } } },
        { id: 'menet', groupId: 'menet-series', displayOrder: 1, slug: 'menet', translations: { en: { name: 'Menet' }, ms: { name: 'Menet' } } },
        { id: 'menet-susu', groupId: 'menet-series', displayOrder: 2, slug: 'menet-susu', translations: { en: { name: 'Menet Susu' }, ms: { name: 'Menet Susu' } } },
        { id: 'menet-premium', groupId: 'menet-series', displayOrder: 3, slug: 'menet-premium', translations: { en: { name: 'Menet Premium' }, ms: { name: 'Menet Premium' } } }
    ];

    const items: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt' | 'displayOrder'>[] = [
      // Darjat
      { categoryId: 'darjat', isGeneral: false, isPopular: true, price: 5.00, slug: 'kopi-darjat', status: 'published', imageUrl: 'https://picsum.photos/seed/kopi-darjat/400', translations: { en: { name: 'Kopi Darjat', description: 'Our signature rich and bold coffee.' }, ms: { name: 'Kopi Darjat', description: 'Kopi istimewa kami yang kaya dan pekat.' } } },
      { categoryId: 'darjat', isGeneral: false, isPopular: false, price: 6.00, slug: 'kopi-darjat-caramel', status: 'published', imageUrl: 'https://picsum.photos/seed/kopi-darjat-caramel/400', translations: { en: { name: 'Kopi Darjat Caramel', description: 'Signature coffee with a sweet caramel twist.' }, ms: { name: 'Kopi Darjat Karamel', description: 'Kopi istimewa dengan sentuhan karamel manis.' } } },
      // Asli
      { categoryId: 'asli', isGeneral: false, isPopular: true, price: 4.00, slug: 'kopi-o', status: 'published', imageUrl: 'https://picsum.photos/seed/kopi-o/400', translations: { en: { name: 'Kopi O', description: 'Classic black coffee.' }, ms: { name: 'Kopi O', description: 'Kopi hitam klasik.' } } },
      { categoryId: 'asli', isGeneral: false, isPopular: false, price: 4.50, slug: 'kopi-c', status: 'published', imageUrl: 'https://picsum.photos/seed/kopi-c/400', translations: { en: { name: 'Kopi C', description: 'Coffee with evaporated milk.' }, ms: { name: 'Kopi C', description: 'Kopi dengan susu sejat.' } } },
      // Susu
      { categoryId: 'susu', isGeneral: false, isPopular: true, price: 5.50, slug: 'susu-caramel', status: 'published', imageUrl: 'https://picsum.photos/seed/susu-caramel/400', translations: { en: { name: 'Susu Caramel', description: 'Fresh milk with caramel.' }, ms: { name: 'Susu Karamel', description: 'Susu segar dengan karamel.' } } },
      // Coklat
      { categoryId: 'coklat', isGeneral: false, isPopular: false, price: 7.00, slug: 'coklat-darjat', status: 'published', imageUrl: 'https://picsum.photos/seed/coklat-darjat/400', translations: { en: { name: 'Coklat Darjat', description: 'Rich signature chocolate.' }, ms: { name: 'Coklat Darjat', description: 'Coklat istimewa yang pekat.' } } },
      // Teh
      { categoryId: 'teh', isGeneral: false, isPopular: false, price: 4.00, slug: 'teh-o', status: 'published', imageUrl: 'https://picsum.photos/seed/teh-o/400', translations: { en: { name: 'Teh O', description: 'Classic black tea.' }, ms: { name: 'Teh O', description: 'Teh hitam klasik.' } } },
      // Menet
      { categoryId: 'menet', isGeneral: false, isPopular: true, price: 8.00, slug: 'matcha-menet', status: 'published', imageUrl: 'https://picsum.photos/seed/matcha-menet/400', translations: { en: { name: 'Matcha Menet', description: 'Premium matcha series.' }, ms: { name: 'Matcha Menet', description: 'Siri matcha premium.' } } },
    ];
    // Add 30 more items
    for (let i = 0; i < 30; i++) {
        const cat = categories[i % categories.length];
        const group = groups.find(g => g.id === cat.groupId);
        items.push({
             categoryId: cat.id, 
             isGeneral: false, 
             isPopular: i % 5 === 0, 
             price: 5.00 + (i*0.1), 
             slug: `item-${group?.slug}-${cat.slug}-${i+1}`, 
             status: 'published', 
             imageUrl: `https://picsum.photos/seed/item-${i+1}/400`, 
             translations: { 
                 en: { name: `Sample ${cat.translations.en.name} ${i+1}`, description: `A delicious sample item number ${i+1}.` }, 
                 ms: { name: `Contoh ${cat.translations.ms.name} ${i+1}`, description: `Contoh minuman lazat nombor ${i+1}.` } 
             }
        });
    }

    groups.forEach(group => {
      batch.set(doc(firestore, 'menuGroups', group.id), group);
      createdCount++;
    });

    categories.forEach(category => {
      batch.set(doc(firestore, 'menuCategories', category.id), { ...category, status: 'published' });
      createdCount++;
    });

    items.forEach((item, index) => {
      const docRef = doc(collection(firestore, 'menuItems'));
      batch.set(docRef, { ...item, outletIds: allOutletIds, displayOrder: index + 1 });
      createdCount++;
    });

    await batch.commit();

    return { success: true, message: `Wiped ${deletedCount} old menu documents and created ${createdCount} new ones.` };
  } catch (error: any) {
    return { success: false, message: `Failed to seed menu data: ${error.message}` };
  }
}
