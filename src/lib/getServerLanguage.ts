
import { cookies } from 'next/headers';
import type { SiteLanguage } from './firestore/getSiteContent';

/**
 * A server-side utility to get the current language from cookies.
 * Defaults to 'en' if the cookie is not set or has an invalid value.
 * @returns The current site language ('en' | 'ms').
 */
export function getServerLanguage(): SiteLanguage {
  const langCookie = cookies().get('lang');

  if (langCookie && (langCookie.value === 'en' || langCookie.value === 'ms')) {
    return langCookie.value;
  }

  return 'en'; // Default language
}
