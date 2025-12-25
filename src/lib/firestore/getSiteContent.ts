
import { initializeServerSideFirebase } from "@/firebase/server-init";
import { getDoc, doc } from 'firebase/firestore';
import type { LangCode } from "../types";

/**
 * Fetches the entire site content object from Firestore, which contains both 'en' and 'ms' translations.
 * This function is intended for server-side use only.
 * @returns The entire content object from 'settings/content', or null if not found.
 */
export async function getSiteContent(): Promise<any | null> {
  try {
    const { firestore } = initializeServerSideFirebase();
    const docRef = doc(firestore, 'settings', 'content');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error("Firestore document 'settings/content' does not exist.");
      return null;
    }

    return docSnap.data();

  } catch (error) {
    console.error(`Error fetching site content:`, error);
    return null;
  }
}
