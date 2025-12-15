
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/types';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

export default function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
      <Button size="lg" onClick={handleAddToCart} className="w-full h-12 text-base">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
  );
}
