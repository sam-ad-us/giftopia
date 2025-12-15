
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
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

    const handleDelete = (offer: Offer) => {
        setSelectedOffer(offer);
        setIsDeleteDialogOpen(true);
    };

    const handleToggleStatus = async (offer: Offer) => {
        if (!firestore) return;
        const newStatus = offer.status === 'active' ? 'inactive' : 'active';
        const offerRef = doc(firestore, 'offers', offer.id);
        try {
        await updateDoc(offerRef, { status: newStatus });
        toast({
            title: 'Offer Updated',
            description: `Offer "${offer.name}" has been set to ${newStatus}.`,
        });
        } catch (error) {
        console.error('Error updating offer status:', error);
        toast({
            title: 'Error',
            description: 'Failed to update offer status.',
            variant: 'destructive',
        });
        }
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
                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                </TableRow>
                            ))}
                            {offers && offers.map((offer) => (
                                <TableRow key={offer.id} data-state={offer.status === 'inactive' ? 'disabled' : ''} className="data-[state=disabled]:opacity-50">
                                    <TableCell className="font-medium">{offer.name}</TableCell>
                                    <TableCell className="capitalize">{offer.type}</TableCell>
                                    <TableCell>{offer.type === 'percentage' ? `${offer.value}%` : `$${offer.value.toFixed(2)}`}</TableCell>
                                    <TableCell>
                                        <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                                            {offer.status}
                                        </Badge>
                                    </TableCell>
                                     <TableCell>
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => handleEdit(offer)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleToggleStatus(offer)}>
                                                {offer.status === 'active' ? 'Disable' : 'Enable'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(offer)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
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
                    <DeleteOfferAlert
                        offer={selectedOffer}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open);
                            if (!open) setSelectedOffer(null);
                        }}
                    />
                </>
            )}
        </div>
    );
}
