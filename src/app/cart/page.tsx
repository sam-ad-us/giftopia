
"use client";

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Loader2, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { Coupon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartCount, cartSubtotal, cartSavings, applyCoupon, discount, cartTotal, appliedCoupon, clearCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const originalSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !firestore) return;

    setIsApplyingCoupon(true);
    const normalizedCode = couponCode.trim().toUpperCase();

    try {
      const couponsRef = collection(firestore, 'coupons');
      const q = query(couponsRef, where('code', '==', normalizedCode), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: "Invalid Coupon",
          description: "The coupon code you entered is not valid.",
          variant: "destructive",
        });
        clearCoupon();
        setCouponCode('');
        return;
      }

      const couponDoc = querySnapshot.docs[0];
      const coupon = { ...couponDoc.data(), id: couponDoc.id } as Coupon;

      if (coupon.status !== 'active') {
        toast({
          title: "Coupon Not Active",
          description: "This coupon has expired or is not active yet.",
          variant: "destructive",
        });
        clearCoupon();
        return;
      }

      // Important: Coupon minimum value should be checked against the subtotal AFTER product offers are applied.
      if (coupon.minimumCartValue && cartSubtotal < coupon.minimumCartValue) {
        toast({
          title: "Minimum Spend Not Met",
          description: `This coupon is valid only on purchases of ₹${coupon.minimumCartValue.toFixed(2)} or more.`,
          variant: "destructive",
        });
        clearCoupon();
        return;
      }
      
      // If valid, apply it via the context
      applyCoupon(coupon);
      toast({
        title: "Coupon Applied!",
        description: `You've received a discount with code ${coupon.code}.`,
      });

    } catch (error) {
      console.error("Error applying coupon:", error);
      toast({
        title: "Error",
        description: "Could not apply coupon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  
  const handleRemoveCoupon = () => {
    clearCoupon();
    setCouponCode('');
    toast({
        title: "Coupon Removed",
        description: "Your cart total has been updated.",
    });
  };


  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 font-headline text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added any gifts yet.</p>
        <Button asChild className="mt-6">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => {
             const productImage = PlaceHolderImages.find(p => p.id === item.images[0]);
             const hasOffer = item.finalPrice < item.price;
             return (
            <Card key={item.id} className="flex items-center p-4">
              <div className="relative h-24 w-24 rounded-md overflow-hidden">
                {productImage && (
                    <Image
                    src={productImage.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    data-ai-hint={productImage.imageHint}
                    />
                )}
              </div>
              <div className="ml-4 flex-grow">
                <h2 className="font-semibold">{item.name}</h2>
                <div className="flex items-baseline gap-2">
                    <p className="text-sm text-muted-foreground">₹{item.finalPrice.toFixed(2)}</p>
                    {hasOffer && <p className="text-xs text-muted-foreground line-through">₹{item.price.toFixed(2)}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-12 h-8 text-center border-0 focus-visible:ring-0 p-0"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            </Card>
          )})}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
               {!appliedCoupon ? (
                 <div className="flex gap-2">
                    <Input
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow"
                    disabled={isApplyingCoupon}
                    />
                    <Button onClick={handleApplyCoupon} disabled={!couponCode.trim() || isApplyingCoupon}>
                    {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </Button>
                </div>
               ) : (
                <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-secondary text-secondary-foreground">
                    <div className='text-sm'>
                        <span className='font-semibold'>{appliedCoupon.code}</span> applied!
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemoveCoupon}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
               )}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{originalSubtotal.toFixed(2)}</span>
              </div>
              {cartSavings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Product Savings</span>
                  <span>-₹{cartSavings.toFixed(2)}</span>
                </div>
              )}
               {discount > 0 && appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">
                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
