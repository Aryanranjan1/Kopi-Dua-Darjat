
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
 * It tries the requested language, then the fallback language, then the first available language,
 * and finally falls back to top-level fields for non-migrated documents.
 * @param doc The document containing the translations field or legacy top-level fields.
 * @param lang The desired language code.
 * @param fallbackLang The fallback language code.
 * @returns The localized content, or an empty object if no translation is found.
 */
export function getLocalized<T>(
  doc: any, // Use `any` to handle both new and legacy structures
  lang: LangCode,
  fallbackLang: LangCode = DEFAULT_LANGUAGE
): Partial<T> {
  if (!doc) return {};

  // 1. Try the requested language in the new `translations` structure
  if (doc.translations?.[lang]) {
    return doc.translations[lang] as Partial<T>;
  }

  // 2. Try the fallback language in the new `translations` structure
  if (doc.translations?.[fallbackLang]) {
    return doc.translations[fallbackLang] as Partial<T>;
  }

  // 3. Fallback for documents that have not been migrated yet.
  // This checks for common top-level fields to determine if it's a legacy document.
  // @ts-ignore
  if (doc.name || doc.title || doc.question || doc.quote || doc.content) {
    return doc as Partial<T>;
  }

  // 4. If nothing else is found, return an empty object.
  return {};
}
