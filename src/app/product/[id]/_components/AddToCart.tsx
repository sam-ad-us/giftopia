
"use client";

import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

export default function AddToCart({ product }: { product: Product }) {

  const handleAddToCart = () => {
    console.log("Add to cart clicked for:", product.name);
  };

  return (
      <Button size="lg" onClick={handleAddToCart} className="w-full h-12 text-base" disabled>
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
  );
}
