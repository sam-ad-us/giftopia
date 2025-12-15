
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import type { CartItem, Product, Coupon, Offer } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { calculateDiscountedPrice } from '@/lib/utils';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, offer?: Offer | null) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  clearCoupon: () => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number; // Represents the total of original prices
  cartSavings: number; // Represents savings from product offers
  discount: number; // Represents savings from coupon
  cartTotal: number;
  appliedCoupon: Coupon | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const addToCart = useCallback((product: Product, quantity: number, offer?: Offer | null) => {
    const finalPrice = calculateDiscountedPrice(product.price, offer);

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity, finalPrice }];
    });
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name}`,
    });
  }, [toast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast({
      title: "Removed from cart",
      variant: "destructive",
    });
  }, [toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);
  
  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
  }, []);

  const clearCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    // Subtotal is now the sum of the final prices (after offers)
    return cart.reduce((total, item) => total + item.finalPrice * item.quantity, 0);
  }, [cart]);

  const cartSavings = useMemo(() => {
      // Savings from product-specific offers
      return cart.reduce((total, item) => {
          const originalItemTotal = item.price * item.quantity;
          const finalItemTotal = item.finalPrice * item.quantity;
          return total + (originalItemTotal - finalItemTotal);
      }, 0);
  }, [cart]);

  const applyCoupon = useCallback((coupon: Coupon) => {
    setAppliedCoupon(coupon);
  }, []);
  
  const discount = useMemo(() => {
    // Discount from a cart-wide coupon
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.minimumCartValue && cartSubtotal < appliedCoupon.minimumCartValue) {
        setTimeout(() => {
            setAppliedCoupon(null);
            toast({
                title: "Coupon Removed",
                description: `Your cart total fell below the ₹${appliedCoupon.minimumCartValue.toFixed(2)} minimum for the coupon.`,
                variant: 'destructive',
            })
        }, 0);
        return 0;
    }

    if (appliedCoupon.type === 'percentage') {
      return cartSubtotal * (appliedCoupon.value / 100);
    }
    if (appliedCoupon.type === 'flat') {
      return Math.min(appliedCoupon.value, cartSubtotal);
    }
    return 0;
  }, [appliedCoupon, cartSubtotal, toast]);

  const cartTotal = useMemo(() => {
      // Total is subtotal (with offers) minus coupon discount
      return Math.max(0, cartSubtotal - discount);
  }, [cartSubtotal, discount]);


  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCoupon,
    clearCart,
    cartCount,
    cartSubtotal,
    cartSavings,
    discount,
    cartTotal,
    appliedCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
