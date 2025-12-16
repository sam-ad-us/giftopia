
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
 * Constructs an absolute image URL. If the input is already a full URL,
 * it returns it as is. Otherwise, it prepends a base URL.
 * For now, we will use picsum as a placeholder.
 * @param imagePath - The image path or filename, or a full URL.
 * @returns A full image URL or null if the input is invalid.
 */
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    if (isFullUrl(imagePath)) {
        return imagePath;
    }
    // In a real scenario, you'd use your image CDN base URL here.
    // Example: `https://your-cdn.com/${imagePath}`
    // Using picsum for placeholder demonstration.
    const seed = imagePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/400/400`;
};
