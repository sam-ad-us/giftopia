"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartContext';

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Button asChild variant="ghost" size="icon" className="hover:bg-sidebar-accent">
      <Link href="/cart" className="relative">
        <ShoppingCart className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
            {cartCount}
          </span>
        )}
        <span className="sr-only">Shopping Cart</span>
      </Link>
    </Button>
  );
}
