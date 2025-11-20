
'use client';

import { collection, writeBatch, getDocs, doc, Firestore, query, limit } from 'firebase/firestore';
import { outlets as outletSeedData } from './data';

async function clearAllCollections(firestore: Firestore): Promise<{ success: boolean; message: string }> {
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
  const batch = writeBatch(firestore);

  try {
    for (const collectionName of collectionsToClear) {
      const snapshot = await getDocs(collection(firestore, collectionName));
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          batch.delete(doc.ref);
          deletedCount++;
        });
      }
    }
    await batch.commit();
    return { success: true, message: `Successfully wiped ${deletedCount} documents.` };
  } catch (error: any) {
    console.error("Error wiping collections: ", error);
    return { success: false, message: `Failed to wipe collections: ${error.message}` };
  }
}

export async function masterSeed(firestore: Firestore): Promise<{ success: boolean, message: string }> {
    if (!firestore) {
        return { success: false, message: 'Firestore is not initialized.' };
    }

    const wipeResult = await clearAllCollections(firestore);
    if (!wipeResult.success) {
        return wipeResult;
    }

    const batch = writeBatch(firestore);
    let createdCount = 0;

    try {
        // --- Outlets ---
        outletSeedData.forEach(outlet => {
            const docRef = doc(firestore, 'outlets', outlet.slug);
            batch.set(docRef, outlet);
            createdCount++;
        });

        // --- Menu ---
        const groups = [
            { id: 'kopi-series', displayOrder: 1, slug: 'kopi-series', status: 'published', translations: { en: { name: 'Kopi Series' }, ms: { name: 'Siri Kopi' } } },
            { id: 'non-kopi', displayOrder: 2, slug: 'non-kopi', status: 'published', translations: { en: { name: 'Non-Kopi' }, ms: { name: 'Bukan Kopi' } } },
            { id: 'menet-series', displayOrder: 3, slug: 'menet-series', status: 'published', translations: { en: { name: 'Menet Series' }, ms: { name: 'Siri Menet' } } }
        ];
        const categories = [
            { id: 'darjat', groupId: 'kopi-series', displayOrder: 1, slug: 'darjat', status: 'published', translations: { en: { name: 'Darjat' }, ms: { name: 'Darjat' } } },
            { id: 'asli', groupId: 'kopi-series', displayOrder: 2, slug: 'asli', status: 'published', translations: { en: { name: 'Asli' }, ms: { name: 'Asli' } } },
            { id: 'susu', groupId: 'non-kopi', displayOrder: 1, slug: 'susu', status: 'published', translations: { en: { name: 'Susu' }, ms: { name: 'Susu' } } },
            { id: 'coklat', groupId: 'non-kopi', displayOrder: 2, slug: 'coklat', status: 'published', translations: { en: { name: 'Coklat' }, ms: { name: 'Coklat' } } },
            { id: 'teh', groupId: 'non-kopi', displayOrder: 3, slug: 'teh', status: 'published', translations: { en: { name: 'Teh' }, ms: { name: 'Teh' } } },
            { id: 'menet', groupId: 'menet-series', displayOrder: 1, slug: 'menet', status: 'published', translations: { en: { name: 'Menet' }, ms: { name: 'Menet' } } },
            { id: 'menet-susu', groupId: 'menet-series', displayOrder: 2, slug: 'menet-susu', status: 'published', translations: { en: { name: 'Menet Susu' }, ms: { name: 'Menet Susu' } } },
            { id: 'menet-premium', groupId: 'menet-series', displayOrder: 3, slug: 'menet-premium', status: 'published', translations: { en: { name: 'Menet Premium' }, ms: { name: 'Menet Premium' } } }
        ];
        const menuItems = [...Array(38)].map((_, i) => {
            const cat = categories[i % categories.length];
            return {
                categoryId: cat.id, isGeneral: true, isPopular: i % 5 === 0, price: 5.00 + (i * 0.1), slug: `item-${cat.slug}-${i + 1}`, status: 'published', imageUrl: `https://picsum.photos/seed/item-${i + 1}/400`,
                translations: { en: { name: `Sample ${cat.translations.en.name} ${i + 1}`, description: `A delicious sample item number ${i + 1}.` }, ms: { name: `Contoh ${cat.translations.ms.name} ${i + 1}`, description: `Contoh minuman lazat nombor ${i + 1}.` } }
            };
        });

        groups.forEach(group => { batch.set(doc(firestore, 'menuGroups', group.id), group); createdCount++; });
        categories.forEach(cat => { batch.set(doc(firestore, 'menuCategories', cat.id), cat); createdCount++; });
        menuItems.forEach((item, index) => { batch.set(doc(collection(firestore, 'menuItems')), { ...item, displayOrder: index }); createdCount++; });

        // --- FAQs ---
        const faqs = [...Array(20)].map((_, i) => ({
          category: ['General', 'Product', 'Franchise'][i % 3],
          translations: {
            en: { question: `This is English question number ${i+1}?`, answer: `This is the detailed English answer for question number ${i+1}.` },
            ms: { question: `Ini soalan Bahasa Melayu nombor ${i+1}?`, answer: `Ini adalah jawapan terperinci dalam Bahasa Melayu untuk soalan nombor ${i+1}.` }
          }
        }));
        faqs.forEach(faq => { batch.set(doc(collection(firestore, 'faq')), faq); createdCount++; });

        // --- Testimonials ---
        const testimonials = [...Array(5)].map((_, i) => ({
          image: `https://i.pravatar.cc/150?img=${i+1}`,
          rating: 4.5,
          translations: {
            en: { name: `Customer ${i+1}`, quote: `This is an amazing English testimonial from a very happy customer, number ${i+1}.`, designation: 'Loyal Patron' },
            ms: { name: `Pelanggan ${i+1}`, quote: `Ini adalah testimoni Bahasa Melayu yang hebat dari pelanggan gembira nombor ${i+1}.`, designation: 'Pelanggan Setia' }
          }
        }));
        testimonials.forEach(t => { batch.set(doc(collection(firestore, 'testimonials')), t); createdCount++; });
        
        // --- Blogs ---
        const blogs = [...Array(20)].map((_, i) => ({
            slug: `blog-post-${i+1}`,
            coverImage: { url: `https://picsum.photos/seed/blog-${i+1}/800/600`, alt: `Blog post ${i+1}` },
            author: { name: 'KDD Team' },
            category: ['News', 'Tips', 'Stories'][i % 3],
            status: 'published',
            isFeatured: i % 4 === 0,
            translations: {
                en: { title: `Amazing English Blog Post Title ${i+1}`, content: `<p>This is the full English content for the blog post, with lots of details.</p>`, excerpt: `This is the short English excerpt for blog post number ${i+1}.` },
                ms: { title: `Tajuk Blog Bahasa Melayu Hebat ${i+1}`, content: `<p>Ini adalah kandungan penuh blog dalam Bahasa Melayu, dengan banyak perincian.</p>`, excerpt: `Ini adalah petikan ringkas Bahasa Melayu untuk catatan blog nombor ${i+1}.` }
            }
        }));
        blogs.forEach(blog => { batch.set(doc(firestore, 'blogs', blog.slug), blog); createdCount++; });
        
        // --- Social Feed ---
        [...Array(20)].forEach((_, i) => {
          const postRef = doc(collection(firestore, 'public_insta_feed'));
          batch.set(postRef, {
            username: `kopi_lover_${i}`, mediaUrl: `https://picsum.photos/seed/insta${i}/600/600`, mediaType: 'IMAGE', permalink: '#', visible: true, pinned: i % 5 === 0, rank: i,
            caption: `Enjoying my favorite brew! #KopiDuaDarjat #${i}`, timestamp: new Date().toISOString(), source: 'manual'
          });
          createdCount++;
        });

        // --- Community Grid ---
        const communityItems = [
          { type: 'portrait', name: 'Alia', imageUrl: 'https://picsum.photos/seed/comm1/400/500', className: 'sm:row-span-2', displayOrder: 1 },
          { type: 'logo', name: 'Partner Inc', imageUrl: '/image/logo-dummy-1.svg', className: '', displayOrder: 2 },
          { type: 'quote', name: 'Ben', role: 'Coffee Enthusiast', quote: 'The best local brew I\'ve ever had!', bgColor: 'bg-yellow-300', className: '', displayOrder: 3 },
          { type: 'portrait', name: 'Ravi', imageUrl: 'https://picsum.photos/seed/comm2/400/500', className: 'sm:row-span-2', displayOrder: 4 },
          { type: 'quote', name: 'Siti', role: 'Entrepreneur', quote: 'A community vibe like no other.', bgColor: 'bg-cyan-200', className: 'sm:col-span-2', displayOrder: 5 },
          { type: 'logo', name: 'Startup Fest', imageUrl: '/image/logo-dummy-2.svg', className: '', displayOrder: 6 },
          { type: 'portrait', name: 'Mei', imageUrl: 'https://picsum.photos/seed/comm3/400/500', className: '', displayOrder: 7 },
          { type: 'logo', name: 'Foodie Mag', imageUrl: '/image/logo-dummy-3.svg', className: '', displayOrder: 8 },
        ];
        communityItems.forEach(item => {
            const docRef = doc(collection(firestore, 'community_items'));
            batch.set(docRef, item);
            createdCount++;
        });

        await batch.commit();
        return { success: true, message: `Database reset and seeded with ${createdCount} new documents.` };
    } catch (error: any) {
        console.error("Error during master seed:", error);
        return { success: false, message: `Seeding failed: ${error.message}` };
    }
}
