
import { cookies } from 'next/headers';
import type { SiteLanguage } from './firestore/getSiteContent';

/**
 * A server-side utility to get the current language from cookies.
 * Defaults to 'en' if the cookie is not set or has an invalid value.
 * @returns The current site language ('en' | 'ms').
 */
export function getServerLanguage(): SiteLanguage {
  const cookieStore = cookies();
  const langCookie = cookieStore.get('lang'); // You can name your cookie anything, e.g., 'NEXT_LOCALE'

  if (langCookie && (langCookie.value === 'en' || langCookie.value === 'ms')) {
    return langCookie.value;
  }

  return 'en'; // Default language
}
