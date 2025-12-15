
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
import { collection, query, doc, updateDoc } from 'firebase/firestore';
import { Offer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { EditOfferDialog } from './_components/EditOfferDialog';
import { DeleteOfferAlert } from './_components/DeleteOfferAlert';

export default function AdminOffersPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const offersQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'offers')) : null),
        [firestore]
    );

    const { data: offers, isLoading } = useCollection<Offer>(offersQuery);

    const handleEdit = (offer: Offer) => {
        setSelectedOffer(offer);
        setIsEditDialogOpen(true);
    };

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
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                </TableRow>
                            ))}
                            {offers && offers.map((offer) => (
                                <TableRow key={offer.id} data-state={offer.status === 'inactive' ? 'disabled' : ''} className="data-[state=disabled]:opacity-50">
                                    <TableCell className="font-medium">{offer.name}</TableCell>
                                    <TableCell className="capitalize">{offer.type}</TableCell>
                                    <TableCell>{offer.type === 'percentage' ? `${offer.value}%` : `₹${offer.value.toFixed(2)}`}</TableCell>
                                    <TableCell>
                                        <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                                            {offer.status}
                                        </Badge>
                                    </TableCell>
                                     <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(offer)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
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
            {selectedOffer && (
                <>
                    <EditOfferDialog
                        offer={selectedOffer}
                        isOpen={isEditDialogOpen}
                        onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) setSelectedOffer(null);
                        }}
                    />
                     {/* The Delete alert can be triggered from within the Edit dialog if necessary */}
                </>
            )}
        </div>
    );
}
