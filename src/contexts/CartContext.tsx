
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import type { CartItem, Product, Coupon } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';


interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  discount: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCodeToApply, setCouponCodeToApply] = useState<string | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const couponsQuery = useMemoFirebase(
    () =>
      firestore && couponCodeToApply
        ? query(collection(firestore, 'coupons'), where('code', '==', couponCodeToApply), where('status', '==', 'active'))
        : null,
    [firestore, couponCodeToApply]
  );
  
  const { data: coupons, isLoading: couponsLoading } = useCollection<Coupon>(couponsQuery);


  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
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

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const applyCoupon = useCallback((code: string) => {
    setCouponCodeToApply(code.toUpperCase());
  }, []);

  useMemo(() => {
    if (couponsLoading || !couponCodeToApply) return;

    const coupon = coupons?.[0];

    if (coupon) {
      if (coupon.minimumCartValue && cartSubtotal < coupon.minimumCartValue) {
        toast({
            title: "Invalid Coupon",
            description: `You must spend at least $${coupon.minimumCartValue.toFixed(2)} to use this coupon.`,
            variant: "destructive",
        });
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(coupon);
        toast({
          title: "Coupon Applied!",
          description: `You've received a discount.`,
        });
      }
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid or has expired.",
        variant: "destructive",
      });
      setAppliedCoupon(null);
    }
    setCouponCodeToApply(null);
  }, [coupons, couponsLoading, cartSubtotal, toast, couponCodeToApply]);


  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === 'percentage') {
      return cartSubtotal * (appliedCoupon.value / 100);
    }
    if (appliedCoupon.type === 'flat') {
      return Math.min(appliedCoupon.value, cartSubtotal);
    }
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = useMemo(() => {
      return cartSubtotal - discount;
  }, [cartSubtotal, discount]);


  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
    cartCount,
    cartSubtotal,
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
