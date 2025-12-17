

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  offer?: string | null;
  showInSubHeader?: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  longDescription: string;
  price: number;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  quantity: number;
  status: 'active' | 'inactive';
  offerId?: string | null;
}

export interface CartItem extends Product {
  quantity: number;
  finalPrice: number; // The price at which the item was added to the cart (including offer)
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
    productSavings: number;
    couponDiscount: number;
    couponCode: string | null;
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

export interface HomepageBanner {
  id: string;
  badgeText?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  isActive: boolean;
}

export interface PersonalizationRequest {
    id: string;
    userId: string;
    productId: string;
    customText?: string;
    customImageUrl?: string;
    additionalInstructions?: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    createdAt: any; // Firestore ServerTimestamp
    cancellationReason?: string;
}
