'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

interface UserOrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserOrderDetailsDialog({ order, isOpen, onOpenChange }: UserOrderDetailsDialogProps) {
  const { toast } = useToast();
  
  if (!order) return null;
  
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'shipped': return 'default';
      case 'delivered': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };
  
  const handleTrackOrder = () => {
    toast({
      title: 'Coming Soon!',
      description: 'Order tracking functionality will be available shortly.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Complete information for order #{order.id.substring(0, 8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <h3 className="font-semibold mb-2">Shipping To</h3>
                <div className="text-sm p-4 bg-muted/50 rounded-lg space-y-1">
                    <p><strong>{order.shippingAddress.name}</strong></p>
                    <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                    <p>{order.shippingAddress.state}, {order.shippingAddress.zip}, {order.shippingAddress.country}</p>
                </div>
                 <div className="mt-4 text-sm space-y-2">
                    <p><strong>Order Date:</strong> {order.createdAt ? format(order.createdAt.toDate(), 'PPpp') : 'N/A'}</p>
                    <div className="flex items-center gap-2"><strong>Status:</strong> <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></div>
                </div>
            </div>
            <div>
                 <h3 className="font-semibold mb-2">Order Summary</h3>
                 <div className="text-sm p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.productSavings > 0 && (
                         <div className="flex justify-between text-green-600">
                            <span>Product Savings:</span>
                            <span>-₹{order.productSavings.toFixed(2)}</span>
                        </div>
                    )}
                    {order.couponDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Coupon ({order.couponCode || 'Discount'}):</span>
                            <span>-₹{order.couponDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    <Separator />
                     <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>₹{order.total.toFixed(2)}</span>
                    </div>
                 </div>
            </div>
             <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">Items Ordered</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map(item => {
                            const itemPrice = item.finalPrice ?? item.price;
                             const imageUrl = getImageUrl(item.images[0], 64);
                            return (
                            <TableRow key={item.id}>
                                <TableCell className="flex items-center gap-4">
                                     <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                        {imageUrl && (
                                            <Image
                                                src={imageUrl}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <span>{item.name}</span>
                                </TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">₹{itemPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right">₹{(itemPrice * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </div>
        </div>
        <DialogFooter className="pt-4 border-t">
          <Button variant="secondary" onClick={handleTrackOrder}>
              <Truck className="mr-2 h-4 w-4"/>
              Track Order
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
