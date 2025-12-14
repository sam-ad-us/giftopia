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
}

export interface CartItem extends Product {
  quantity: number;
}
