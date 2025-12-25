
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Promotion, LangCode } from "./types";
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
 * Retrieves the localized version of a field from a document.
 * @param doc The document containing the 'en' and 'ms' language objects.
 * @param lang The desired language code ('en' | 'ms').
 * @returns The content object for the specified language.
 */
export function getLocalized<T>(
  doc: any,
  lang: LangCode,
): Partial<T> {
  if (!doc) return {};

  // Return the specific language object, defaulting to 'en'
  return doc[lang] || doc[DEFAULT_LANGUAGE] || {};
}
