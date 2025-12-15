'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function AddToCart({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <Button
      size="lg"
      onClick={handleAddToCart}
      className="w-full h-12 text-base"
      disabled={product.stockStatus === 'out-of-stock' || product.status !== 'active'}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {product.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
}
