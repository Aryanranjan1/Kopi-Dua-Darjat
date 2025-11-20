
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Promotion, Localized, LangCode } from "./types";
import { DEFAULT_LANGUAGE } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDiscountDisplay(promo: Promotion): string {
    const localized = getLocalized(promo, 'en');
    switch (promo.discountType) {
        case 'percentage':
            return `${promo.discountValue}% OFF`;
        case 'flat':
            return `RM${promo.discountValue.toFixed(2)} OFF`;
        case 'bogo':
            return 'BOGO';
        case 'custom':
            return localized.customDiscountDescription || 'Special Offer';
        default:
            return 'On Offer';
    }
}

/**
 * Retrieves the localized version of a field from a document.
 * It tries the requested language, then the fallback language, then the first available language.
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
  if (!doc) return {};
  if (doc?.translations?.[lang]) {
    return doc.translations[lang] as Partial<T>;
  }
  if (doc?.translations?.[fallbackLang]) {
    return doc.translations[fallbackLang] as Partial<T>;
  }
  // If specific and fallback languages are not found, try the first available translation.
  if (doc?.translations) {
      const availableLangs = Object.keys(doc.translations);
      if (availableLangs.length > 0) {
          return doc.translations[availableLangs[0] as LangCode] as Partial<T>;
      }
  }
  // Fallback for documents that have not been migrated yet.
  // @ts-ignore
  if (doc.name || doc.title || doc.question) {
    return doc as Partial<T>;
  }

  return {};
}
