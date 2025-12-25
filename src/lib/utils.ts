
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Promotion, LangCode, Localized } from "./types";
import { DEFAULT_LANGUAGE } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDiscountDisplay(promo: Promotion): string {
    switch (promo.discountType) {
        case 'percentage':
            return `${promo.discountValue}% OFF`;
        case 'flat':
            return `RM${promo.discountValue?.toFixed(2)} OFF`;
        case 'bogo':
            return 'BOGO';
        case 'custom':
            return promo.customDiscountDescription || 'Special Offer';
        default:
            return 'On Offer';
    }
}

/**
 * Retrieves the localized version of a field from a document that has a `translations` object.
 * Falls back to the default language if the requested language is not available.
 * @param doc The document containing the translations field.
 * @param lang The desired language code.
 * @param fallbackLang The fallback language code.
 * @returns The localized content, or an empty object if no translation is found.
 */
export function getLocalized<T>(
  doc: Localized<T> | null | undefined,
  lang: LangCode,
  fallbackLang: LangCode = DEFAULT_LANGUAGE
): Partial<T> {
  if (!doc || !doc.translations) return {};
  
  if (doc.translations[lang] && Object.keys(doc.translations[lang]).length > 0) {
    return doc.translations[lang] as Partial<T>;
  }
  if (doc.translations[fallbackLang]) {
    return doc.translations[fallbackLang] as Partial<T>;
  }
  return {};
}

    