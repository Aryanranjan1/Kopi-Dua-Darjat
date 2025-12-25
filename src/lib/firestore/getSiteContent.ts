
import { initializeServerSideFirebase } from "@/firebase/server-init";
import { getDoc, doc } from 'firebase/firestore';

export type SiteLanguage = 'en' | 'ms';

/**
 * Fetches the site content for a specific language from Firestore using the Admin SDK.
 * This function is intended for server-side use only.
 * @param lang - The language ('en' or 'ms') for which to fetch content.
 * @returns The content object for the specified language, or null if not found.
 */
export async function getSiteContent(lang: SiteLanguage): Promise<any | null> {
  try {
    const { firestore } = initializeServerSideFirebase();
    const docRef = doc(firestore, 'settings', 'content');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error("Firestore document 'settings/content' does not exist.");
      return null;
    }

    const allContent = docSnap.data();
    
    // Return the content for the specific language
    return allContent?.[lang] || null;

  } catch (error) {
    console.error(`Error fetching site content for lang '${lang}':`, error);
    // In a production scenario, you might want to handle this more gracefully,
    // but for now, we'll return null and let the page show a 404.
    return null;
  }
}
