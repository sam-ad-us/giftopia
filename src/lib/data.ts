import type { Category, Product, Coupon } from './types';

export const categories: Category[] = [
  { id: 'birthday-gifts', name: 'Birthday Gifts', image: 'cat-birthday', offer: 'Up to 20% Off' },
  { id: 'anniversary-gifts', name: 'Anniversary Gifts', image: 'cat-anniversary' },
  { id: 'wedding-gifts', name: 'Wedding Gifts', image: 'cat-wedding', offer: 'Free Gift Wrap' },
  { id: 'for-her', name: 'For Her', image: 'cat-for-her' },
  { id: 'for-him', name: 'For Him', image: 'cat-for-him' },
  { id: 'personalized-gifts', name: 'Personalized Gifts', image: 'cat-personalized' },
  { id: 'kids-gifts', name: 'Kids Gifts', image: 'cat-kids' },
  { id: 'corporate-gifts', name: 'Corporate Gifts', image: 'cat-corporate' },
  { id: 'festival-gifts', name: 'Festival Gifts', image: 'cat-festival' },
];

// Note: This is now just placeholder data for components that haven't been migrated to Firestore yet.
export const products: Product[] = [];


export const coupons: Coupon[] = [
  {
    code: 'GIFT10',
    type: 'percentage',
    value: 10,
  },
  {
    code: 'SAVE20',
    type: 'flat',
    value: 20,
    minimumCartValue: 50,
  }
];
