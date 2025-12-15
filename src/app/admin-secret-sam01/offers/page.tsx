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
import { CreateOfferDialog } from './_components/CreateOfferDialog';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Offer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminOffersPage() {
    const firestore = useFirestore();

    const offersQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'offers')) : null),
        [firestore]
    );

    const { data: offers, isLoading } = useCollection<Offer>(offersQuery);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
                    <p className="text-muted-foreground">Create and manage special offers.</p>
                </div>
                 <CreateOfferDialog />
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Offers</CardTitle>
                    <CardDescription>A list of all special offers available in your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Offer Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                </TableRow>
                            ))}
                            {offers && offers.map((offer) => (
                                <TableRow key={offer.id}>
                                    <TableCell className="font-medium">{offer.name}</TableCell>
                                    <TableCell className="capitalize">{offer.type}</TableCell>
                                    <TableCell>{offer.type === 'percentage' ? `${offer.value}%` : `$${offer.value.toFixed(2)}`}</TableCell>
                                    <TableCell>
                                        <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                                            {offer.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {!isLoading && (!offers || offers.length === 0) && (
                        <div className="flex h-[150px] items-center justify-center text-center">
                            <p className="text-muted-foreground">No offers found. Create one to get started!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
