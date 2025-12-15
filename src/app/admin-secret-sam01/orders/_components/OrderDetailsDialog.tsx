
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ order, isOpen, onOpenChange }: OrderDetailsDialogProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Complete information for order #{order.id.substring(0, 8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <h3 className="font-semibold mb-2">Customer & Shipping</h3>
                <div className="text-sm p-4 bg-muted/50 rounded-lg space-y-2">
                    <p><strong>Name:</strong> {order.shippingAddress.name}</p>
                    <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}, {order.shippingAddress.country}</p>
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
                            return (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">₹{itemPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right">₹{(itemPrice * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
