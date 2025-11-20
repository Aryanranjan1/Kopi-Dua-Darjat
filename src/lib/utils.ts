
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

export function getLocalized<T>(
  doc: Localized<T>,
  lang: LangCode,
  fallbackLang: LangCode = DEFAULT_LANGUAGE
): Partial<T> {
  if (doc?.translations?.[lang]) {
    return doc.translations[lang] as Partial<T>;
  }
  if (doc?.translations?.[fallbackLang]) {
    return doc.translations[fallbackLang] as Partial<T>;
  }
  // Fallback to top-level fields for backward compatibility
  // @ts-ignore
  if (doc.name || doc.title) return doc;

  return {};
}
