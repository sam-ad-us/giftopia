
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Offer } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getOfferText = (offer: Offer) => {
    if (offer.type === 'percentage') {
        return `${offer.name} (${offer.value}% off)`;
    }
    return `${offer.name} (₹${offer.value} off)`;
}

export const calculateDiscountedPrice = (originalPrice: number, offer: Offer | null | undefined) => {
  if (!offer) {
    return originalPrice;
  }
  if (offer.type === 'percentage') {
    return originalPrice * (1 - offer.value / 100);
  }
  if (offer.type === 'flat') {
    return Math.max(0, originalPrice - offer.value);
  }
  return originalPrice;
};
