
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Promotion } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDiscountDisplay = (promo: Promotion): string => {
    switch (promo.discountType) {
        case 'percentage':
            return `${promo.discountValue}% OFF`;
        case 'flat':
            return `RM${promo.discountValue.toFixed(2)} OFF`;
        case 'bogo':
            return 'BOGO';
        case 'custom':
            return promo.customDiscountDescription || 'Special Offer';
        default:
            return 'On Offer';
    }
}
