"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartContext';

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Button asChild variant="ghost" size="icon">
      <Link href="/cart" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {cartCount}
          </span>
        )}
        <span className="sr-only">Shopping Cart</span>
      </Link>
    </Button>
  );
}
