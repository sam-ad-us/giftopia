
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

// Helper function to check if a string is a valid URL
const isFullUrl = (urlString: string | null | undefined): boolean => {
    if (!urlString) return false;
    try {
        new URL(urlString);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Constructs an absolute image URL. If the input is already a full URL (like from ImageKit),
 * it returns it as is. Otherwise, it generates a placeholder URL.
 * @param imagePath - The image path or filename, or a full URL.
 * @returns A full image URL or null if the input is invalid.
 */
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;

    // If it's already a full URL (like from ImageKit), return it directly.
    if (isFullUrl(imagePath)) {
        return imagePath;
    }
    
    // Otherwise, generate a placeholder URL.
    const seed = imagePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/400/400`;
};
