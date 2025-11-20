
import { doc, DocumentReference, Firestore, setDoc, getDoc } from 'firebase/firestore';
import { LangCode, Localized, DEFAULT_LANGUAGE } from './types';

/**
 * Retrieves the localized version of a field from a document.
 * Falls back to the default language if the requested language is not available.
 * @param doc The document containing the translations field.
 * @param lang The desired language code.
 * @param fallbackLang The fallback language code.
 * @returns The localized content, or an empty object if no translation is found.
 */
export function getLocalized<T>(
  doc: Localized<T>,
  lang: LangCode,
  fallbackLang: LangCode = DEFAULT_LANGUAGE
): Partial<T> {
  if (doc?.translations?.[lang]) {
    return doc.translations[lang] as Partial<T>;
  }
  if (doc?.translations?.[fallbackLang]) {
    console.warn(`[getLocalized] Translation for '${lang}' not found. Falling back to '${fallbackLang}'.`);
    return doc.translations[fallbackLang] as Partial<T>;
  }
  return {};
}

/**
 * Ensures that the translations object and the specific language object exist on a document.
 * @param docRef The Firestore document reference.
 * @param lang The language code to ensure.
 */
export async function ensureTranslations(docRef: DocumentReference, lang: LangCode) {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.translations || !data.translations[lang]) {
            const payload: any = {};
            if (!data.translations) {
                payload.translations = { [lang]: {} };
            } else {
                payload.translations = { ...data.translations, [lang]: {} };
            }
            await setDoc(docRef, payload, { merge: true });
        }
    }
}

/**
 * Updates the localized content for a specific language on a Firestore document.
 * @param firestore Firestore instance.
 * @param collectionName The name of the collection.
 * @param docId The ID of the document.
 * @param lang The language code to update.
 * @param payload The data to save for the specified language.
 */
export async function setLocalized(
  firestore: Firestore,
  collectionName: string,
  docId: string,
  lang: LangCode,
  payload: any
) {
  const docRef = doc(firestore, collectionName, docId);
  const updatePayload = {
    translations: {
      [lang]: payload
    },
    updatedAt: new Date(),
  };
  return setDoc(docRef, updatePayload, { merge: true });
}
