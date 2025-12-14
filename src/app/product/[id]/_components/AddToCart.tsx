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
    <div className="flex items-center gap-4 mt-4">
      <div className="flex items-center border rounded-md">
        <Button variant="ghost" size="icon" onClick={decrement}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="w-16 text-center border-0 focus-visible:ring-0"
        />
        <Button variant="ghost" size="icon" onClick={increment}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button size="lg" onClick={handleAddToCart} className="flex-grow sm:flex-grow-0">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
}
