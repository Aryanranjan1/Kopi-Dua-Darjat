
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
        const blogsData = [
            {
                slug: "the-story-behind-every-cup-why-great-coffee-matters",
                author: { bio: "heyyyyyy", name: "Admin", photo: "https://images.unsplash.com/photo-1759376928130-415a2e369c3e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
                category: "Behind The Cup",
                coverImage: { alt: "A barista pouring freshly brewed coffee", caption: "A perfect cup starts with passion.", url: "https://images.unsplash.com/photo-1762657424841-7b5166d5d54c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
                isFeatured: true,
                likes: 0,
                seo: { description: "Discover the journey of great coffee — from farming and roasting to brewing and craft. Learn why every cup matters.", keywords: ["coffee", "kopi", "franchise"], title: "The Story Behind Every Cup | Why Great Coffee Matters" },
                status: "published",
                tags: ["coffee", "story", "tips"],
                translations: {
                    en: {
                        content: "## The Story Behind Every Cup: Why Great Coffee Matters\n\nCoffee is more than just a drink — it's a ritual, a culture, and for many of us, a way to slow down and reconnect with the moment. Behind every cup, there is a journey that starts long before the aroma hits your nose.\n\n### 🌱 From Farm to Cup\n\nGreat coffee begins at the source. Farmers who hand-pick ripe cherries are the unsung heroes of every brew. Their dedication affects everything from flavour balance to aroma.\n\n### ☕ The Craft of Brewing\n\nBrewing is both art and science. The grind size, water temperature, and brewing time come together to shape the final taste. A small adjustment can turn a good cup into an unforgettable one.\n\n### 👨‍🍳 The Human Touch\n\nBehind every café counter is a barista who turns raw beans into a story. Their skill brings out the best in every roast and creates an experience that customers return for.\n\n### 💛 Why It All Matters\n\nGreat coffee connects people. Conversations happen. Ideas flow. Communities grow. So the next time you enjoy your cup, take a moment to appreciate the journey it took — from the farm to your hands. ",
                        excerpt: "A deep dive into what makes a truly great cup of coffee — from beans and brewing to the people behind the craft.",
                        title: "The Story Behind Every Cup: Why Great Coffee Matters"
                    },
                    ms: {
                        content: "## Kisah di Sebalik Setiap Cawan: Mengapa Kopi Hebat Penting\n\nKopi bukan sekadar minuman — ia adalah ritual, budaya, dan bagi ramai, satu cara untuk berhenti seketika dan menikmati momen. Di sebalik setiap cawan, terdapat perjalanan panjang sebelum aromanya memenuhi udara.\n\n### 🌱 Dari Ladang ke Cawan\n\nKopi hebat bermula di sumbernya. Petani yang memilih biji kopi masak dengan teliti adalah wira yang jarang disebut. Dedikasi mereka mempengaruhi keseimbangan rasa dan aroma.\n\n### ☕ Seni Membancuh\n\nMembancuh kopi adalah seni dan sains. Saiz kisar, suhu air, dan masa bancuhan membentuk rasa akhir kopi. Sedikit perbezaan boleh mengubah kopi biasa menjadi sesuatu yang luar biasa.\n\n### 👨‍🍳 Sentuhan Manusia\n\nDi belakang kaunter kafe, barista memainkan peranan penting. Kemahiran mereka menghidupkan aroma dan rasa, menjadikan setiap cawan satu pengalaman.\n\n### 💛 Mengapa Semua Ini Penting\n\nKopi menyatukan manusia. Perbualan bermula. Idea tercetus. Komuniti terbina. Jadi, apabila anda menikmati secawan kopi, ambillah sedikit masa untuk menghargai perjalanan yang telah dilaluinya — dari ladang hingga ke tangan anda. ",
                        excerpt: "Menjelajah perjalanan kopi — dari ladang hingga ke barista — dan mengapa setiap cawan membawa kisahnya sendiri.",
                        title: "Kisah di Sebalik Setiap Cawan: Mengapa Kopi Hebat Penting"
                    }
                },
                views: 0
            }
        ];
        
        [...Array(14)].forEach((_, i) => {
            blogsData.push({
                slug: `sample-blog-post-${i + 2}`,
                author: { bio: "A passionate writer at Kopi Dua Darjat.", name: "KDD Writer", photo: "https://i.pravatar.cc/150?img=1" },
                category: ["Community", "How-To", "News"][i % 3],
                coverImage: { alt: `A beautiful image for post ${i + 2}`, caption: "Coffee love", url: `https://picsum.photos/seed/blog-sample-${i+2}/800/600` },
                isFeatured: i % 4 === 0,
                likes: 0,
                seo: { description: `Sample English SEO description for blog post ${i + 2}.`, keywords: ["sample", "blog"], title: `Sample English Blog Title ${i + 2}` },
                status: "published",
                tags: ["sample", "kopi"],
                translations: {
                    en: {
                        content: `This is the sample English content for blog post number ${i + 2}. It's just a placeholder to show how it looks.`,
                        excerpt: `A short and sweet English excerpt for sample blog post number ${i + 2}.`,
                        title: `Sample English Blog Title ${i + 2}`
                    },
                    ms: {
                        content: `Ini adalah contoh kandungan Bahasa Melayu untuk catatan blog nombor ${i + 2}. Ia hanyalah pemegang tempat untuk menunjukkan rupa bentuknya.`,
                        excerpt: `Petikan ringkas Bahasa Melayu untuk contoh catatan blog nombor ${i + 2}.`,
                        title: `Contoh Tajuk Blog Bahasa Melayu ${i + 2}`
                    }
                },
                views: 0
            });
        });

        blogsData.forEach(blog => {
            const now = new Date();
            batch.set(doc(firestore, 'blogs', blog.slug), {
                ...blog,
                createdAt: now,
                updatedAt: now,
                publishedAt: now,
            });
            createdCount++;
        });
        
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
