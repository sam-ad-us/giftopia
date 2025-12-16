
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
 * Constructs an optimized ImageKit URL or returns a valid placeholder.
 * @param imagePath - A full ImageKit URL or a path/ID.
 * @param width - The desired width for optimization.
 * @returns A full, optimized image URL or null.
 */
export const getImageUrl = (imagePath: string | null | undefined, width?: number): string | null => {
    if (!imagePath) return null;

    // If it's already a full ImageKit URL, append transformations.
    if (isFullUrl(imagePath) && imagePath.includes('ik.imagekit.io')) {
        const url = new URL(imagePath);
        const transformations: string[] = ['q-auto', 'f-auto']; // quality and format auto
        if (width) {
            transformations.push(`w-${width}`);
        }
        url.searchParams.set('tr', transformations.join(','));
        return url.toString();
    }
    
    // If it's another full URL, return it as is.
    if (isFullUrl(imagePath)) {
        return imagePath;
    }

    // Otherwise, generate a placeholder URL based on the path/ID.
    const seed = imagePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const placeholderWidth = width || 400;
    return `https://picsum.photos/seed/${seed}/${placeholderWidth}/${placeholderWidth}`;
};
