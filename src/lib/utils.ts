
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

const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/5wpkzy7ok/"; 

export const getImageUrl = (imageIdentifier: string): string => {
  if (!imageIdentifier) return '';
  // If it's already a full URL, return it
  if (imageIdentifier.startsWith('http')) {
    return imageIdentifier;
  }
  // Otherwise, construct the ImageKit URL
  return `${IMAGEKIT_BASE_URL}${imageIdentifier}`;
}
