'use client';

import { useCart } from '@/contexts/CartContext';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Landmark, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

const shippingSchema = z.object({
  name: z.string().min(2, 'Full name is required.'),
  address: z.string().min(5, 'Street address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State / Province is required.'),
  zip: z.string().min(4, 'ZIP / Postal code is required.'),
  country: z.string().min(2, 'Country is required.'),
  paymentMethod: z.enum(['card', 'bank'], {
    required_error: 'You need to select a payment method.',
  }),
});

export default function CheckoutPage() {
  const { cart, cartCount, cartSubtotal, discount, cartTotal, clearCart } = useCart();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: user?.displayName || '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      paymentMethod: 'card',
    },
  });

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login?redirect=/checkout');
    }
    if (cartCount === 0) {
      router.push('/');
    }
  }, [user, isUserLoading, cartCount, router]);

  const onSubmit = async (values: z.infer<typeof shippingSchema>) => {
    if (!user || !firestore) {
      toast({
        title: 'Error',
        description: 'You must be logged in to place an order.',
        variant: 'destructive',
      });
      return;
    }

    const orderData = {
      userId: user.uid,
      customerName: user.displayName || values.name,
      items: cart,
      subtotal: cartSubtotal,
      discount,
      total: cartTotal,
      shippingAddress: {
        name: values.name,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        country: values.country,
      },
      paymentMethod: values.paymentMethod,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(firestore, 'orders'), orderData);
      toast({
        title: 'Order Placed!',
        description: 'Thank you for your purchase. Your order is being processed.',
      });
      clearCart();
      router.push('/profile'); // Redirect to a profile/orders page
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: 'There was a problem placing your order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isUserLoading || !user || cartCount === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
            <Link href="/cart"><ArrowLeft /></Link>
        </Button>
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Checkout</h1>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="address" render={({ field }) => ( <FormItem className="sm:col-span-2"><FormLabel>Street Address</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="city" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="state" render={({ field }) => ( <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input placeholder="CA" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="zip" render={({ field }) => ( <FormItem><FormLabel>ZIP / Postal Code</FormLabel><FormControl><Input placeholder="90210" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="country" render={({ field }) => ( <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="USA" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>All transactions are secure and encrypted.</CardDescription>
                </CardHeader>
                <CardContent>
                   <FormField control={form.control} name="paymentMethod" render={({ field }) => ( <FormItem><FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2 gap-4">
                        <FormItem>
                            <Label htmlFor="card" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <RadioGroupItem value="card" id="card" className="sr-only" />
                                <CreditCard className="mb-3 h-6 w-6" />
                                Credit Card (Simulated)
                            </Label>
                        </FormItem>
                        <FormItem>
                            <Label htmlFor="bank" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <RadioGroupItem value="bank" id="bank" className="sr-only" />
                                <Landmark className="mb-3 h-6 w-6" />
                                Bank Transfer (Simulated)
                            </Label>
                        </FormItem>
                      </RadioGroup>
                  </FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Placing Order...</>
                ) : `Place Order - $${cartTotal.toFixed(2)}`}
              </Button>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-28">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between"><span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
              {discount > 0 && (<div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>)}
              <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${cartTotal.toFixed(2)}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
