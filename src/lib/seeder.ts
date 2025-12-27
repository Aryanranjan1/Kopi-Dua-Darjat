
'use client';

import { collection, writeBatch, getDocs, doc, Firestore, query, serverTimestamp } from 'firebase/firestore';

export async function seedFaqAndTestimonials(
  firestore: Firestore, 
  faqData: any[], 
  testimonialData: any[]
): Promise<{ success: boolean, message: string, error?: string }> {
  if (!firestore) {
    return { success: false, message: 'Firestore is not initialized.' };
  }

  const faqCollection = collection(firestore, 'faq');
  const testimonialsCollection = collection(firestore, 'testimonials');

  try {
    const batch = writeBatch(firestore);

    // Clear existing data
    const existingFaqs = await getDocs(faqCollection);
    existingFaqs.forEach(doc => batch.delete(doc.ref));

    const existingTestimonials = await getDocs(testimonialsCollection);
    existingTestimonials.forEach(doc => batch.delete(doc.ref));

    // Seed new FAQ data
    faqData.forEach(faq => {
      const docRef = doc(faqCollection);
       const category = faq.category.charAt(0).toUpperCase() + faq.category.slice(1);
      batch.set(docRef, { ...faq, category });
    });

    // Seed new Testimonial data
    testimonialData.forEach(testimonial => {
      const docRef = doc(testimonialsCollection);
      batch.set(docRef, { ...testimonial, createdAt: serverTimestamp() });
    });

    await batch.commit();
    return { success: true, message: `Successfully seeded ${faqData.length} FAQs and ${testimonialData.length} testimonials.` };

  } catch (error) {
    console.error("Error seeding FAQ and Testimonials: ", error);
    return { success: false, message: 'Seeding failed.', error: (error as Error).message };
  }
}

export async function seedBlogs(
  firestore: Firestore, 
  blogData: any[]
): Promise<{ success: boolean, message: string, error?: string }> {
   if (!firestore) {
    return { success: false, message: 'Firestore is not initialized.' };
  }

  const blogCollection = collection(firestore, 'blogs');

  try {
    const batch = writeBatch(firestore);

    // 1. Clear existing blogs
    const existingBlogs = await getDocs(blogCollection);
    existingBlogs.forEach(doc => batch.delete(doc.ref));

    // 2. Seed new blog data
    blogData.forEach(blog => {
      // Use the slug as the document ID for predictable URLs
      const docRef = doc(blogCollection, blog.slug);
      
      const excerpt = blog.translations.en.content.substring(0, 150) + '...';

      const dataToSave = {
        ...blog,
        // Add default fields if they are missing from the JSON
        coverImage: {
          url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
          alt: blog.translations.en.title,
          caption: ''
        },
        author: {
          name: 'Kopi Dua Darjat',
          photo: '',
          bio: 'The official voice of Kopi Dua Darjat.'
        },
        tags: blog.tags || ['Kopi Dua Darjat', 'Coffee'],
        status: 'published',
        isFeatured: false,
        translations: {
          en: {
            title: blog.translations.en.title,
            content: blog.translations.en.content,
            excerpt: blog.translations.en.excerpt || excerpt
          },
          ms: {
            title: blog.translations.ms.title,
            content: blog.translations.ms.content,
            excerpt: blog.translations.ms.excerpt || excerpt
          }
        },
        views: 0,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: serverTimestamp(),
      };

      batch.set(docRef, dataToSave);
    });

    await batch.commit();
    return { success: true, message: `Successfully cleared and seeded ${blogData.length} blog posts.` };

  } catch (error) {
    console.error("Error seeding Blogs: ", error);
    return { success: false, message: 'Blog seeding failed.', error: (error as Error).message };
  }
}

    