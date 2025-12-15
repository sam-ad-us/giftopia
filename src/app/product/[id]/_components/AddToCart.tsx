
"use client";

import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

export default function AddToCart({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
      <Button size="lg" onClick={handleAddToCart} className="w-full h-12 text-base">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
  );
}
