'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserOrderDetailsDialog } from './_components/UserOrderDetailsDialog';

export default function UserOrdersPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login?redirect=/profile/your-order');
    }
  }, [user, isUserLoading, router]);

  const ordersQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, 'orders'), where('userId', '==', user.uid)) : null),
    [firestore, user]
  );

  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => {
      const dateA = a.createdAt?.toDate()?.getTime() || 0;
      const dateB = b.createdAt?.toDate()?.getTime() || 0;
      return dateB - dateA;
    });
  }, [orders]);


  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleTrackOrder = () => {
    toast({
      title: 'Coming Soon!',
      description: 'Order tracking functionality will be available shortly.',
    });
  };
  
    if (isUserLoading || !user) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <>
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
            <Link href="/profile"><ArrowLeft /></Link>
        </Button>
        <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">My Orders</h1>
            <p className="text-muted-foreground">View your complete order history.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>A list of all orders you've placed with Giftopia.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-5 w-8 mx-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                {sortedOrders &&
                  sortedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="whitespace-nowrap">{order.createdAt ? format(order.createdAt.toDate(), 'MMM d, yyyy') : 'N/A'}</TableCell>
                      <TableCell>₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="mr-2 h-4 w-4"/>
                              Details
                          </Button>
                          <Button variant="secondary" size="sm" onClick={handleTrackOrder}>
                              <Truck className="mr-2 h-4 w-4"/>
                              Track
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {!isLoading && (!sortedOrders || sortedOrders.length === 0) && (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <p className="text-lg font-medium text-muted-foreground">You haven't placed any orders yet.</p>
              <Button asChild className="mt-4">
                  <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    {selectedOrder && (
        <UserOrderDetailsDialog
            order={selectedOrder}
            isOpen={!!selectedOrder}
            onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}
        />
    )}
    </>
  );
}
