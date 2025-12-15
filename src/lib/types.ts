

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
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minimumCartValue?: number;
  status: 'active' | 'inactive';
}


export interface Offer {
  id: string;
  name: string;
  type: 'percentage' | 'flat';
  value: number;
  status: 'active' | 'inactive';
}

export interface Order {
    id: string;
    userId: string;
    customerName: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    paymentMethod: string;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: any; // Firestore ServerTimestamp
}
