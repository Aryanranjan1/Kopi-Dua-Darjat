
'use client';

import { collection, writeBatch, getDocs, doc, Firestore, query } from 'firebase/firestore';

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
    const writeBatch = firestore ? writeBatch(firestore) : null;
    if (!writeBatch) throw new Error("Batch could not be created.");

    // Clear existing data
    const existingFaqs = await getDocs(faqCollection);
    existingFaqs.forEach(doc => writeBatch.delete(doc.ref));

    const existingTestimonials = await getDocs(testimonialsCollection);
    existingTestimonials.forEach(doc => writeBatch.delete(doc.ref));

    // Seed new FAQ data
    faqData.forEach(faq => {
      const docRef = doc(faqCollection);
      writeBatch.set(docRef, faq);
    });

    // Seed new Testimonial data
    testimonialData.forEach(testimonial => {
      const docRef = doc(testimonialsCollection);
      writeBatch.set(docRef, testimonial);
    });

    await writeBatch.commit();
    return { success: true, message: `Successfully seeded ${faqData.length} FAQs and ${testimonialData.length} testimonials.` };

  } catch (error) {
    console.error("Error seeding FAQ and Testimonials: ", error);
    return { success: false, message: 'Seeding failed.', error: (error as Error).message };
  }
}
