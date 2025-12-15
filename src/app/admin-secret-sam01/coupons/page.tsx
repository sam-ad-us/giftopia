
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
import { CreateCouponDialog } from './_components/CreateCouponDialog';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Coupon } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminCouponsPage() {
    const firestore = useFirestore();

    const couponsQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'coupons')) : null),
        [firestore]
    );

    const { data: coupons, isLoading } = useCollection<Coupon>(couponsQuery);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">Manage your discount coupons.</p>
                </div>
                <CreateCouponDialog />
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Coupons</CardTitle>
                    <CardDescription>A list of all discount coupons available in your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Min. Spend</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                </TableRow>
                            ))}
                            {coupons && coupons.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                                    <TableCell className="capitalize">{coupon.type}</TableCell>
                                    <TableCell>{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}</TableCell>
                                    <TableCell>{coupon.minimumCartValue ? `$${coupon.minimumCartValue.toFixed(2)}` : 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'}>
                                            {coupon.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {!isLoading && (!coupons || coupons.length === 0) && (
                        <div className="flex h-[150px] items-center justify-center text-center">
                            <p className="text-muted-foreground">No coupons found. Create one to get started!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
