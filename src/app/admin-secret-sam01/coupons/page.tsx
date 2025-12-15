
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
import { collection, query, doc, updateDoc } from 'firebase/firestore';
import { Coupon } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { DeleteCouponAlert } from './_components/DeleteCouponAlert';
import { EditCouponDialog } from './_components/EditCouponDialog';

export default function AdminCouponsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const couponsQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'coupons')) : null),
        [firestore]
    );

    const { data: coupons, isLoading } = useCollection<Coupon>(couponsQuery);

    const handleEdit = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setIsEditDialogOpen(true);
    };

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
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
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
                                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                </TableRow>
                            ))}
                            {coupons && coupons.map((coupon) => (
                                <TableRow key={coupon.id} data-state={coupon.status === 'inactive' ? 'disabled' : ''} className="data-[state=disabled]:opacity-50">
                                    <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                                    <TableCell className="capitalize">{coupon.type}</TableCell>
                                    <TableCell>{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}</TableCell>
                                    <TableCell>{coupon.minimumCartValue ? `$${coupon.minimumCartValue.toFixed(2)}` : 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'}>
                                            {coupon.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(coupon)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
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
            {selectedCoupon && (
                <>
                    <EditCouponDialog
                        coupon={selectedCoupon}
                        isOpen={isEditDialogOpen}
                        onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) setSelectedCoupon(null);
                        }}
                    />
                    {/* The Delete alert can be triggered from within the Edit dialog if necessary */}
                </>
            )}
        </div>
    );
}
