export interface Category {
  id: string;
  name: string;
  image: string;
  offer?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  stockStatus?: 'in-stock' | 'out-of-stock';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minimumCartValue?: number;
}

export interface Offer {
  id: string;
  name: string;
  type: 'percentage' | 'flat';
  value: number;
  status: 'active' | 'inactive';
}
