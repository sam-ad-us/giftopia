
'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Image as ImageIcon, PlusCircle, Check, X, Trash } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, doc, deleteDoc } from 'firebase/firestore';
import { HomepageBanner, Offer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CreateOfferDialog } from '../offers/_components/CreateOfferDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { EditOfferDialog } from '../offers/_components/EditOfferDialog';
import { Separator } from '@/components/ui/separator';
import { getImageUrl } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { EditHomepageBannerDialog } from './_components/EditHomepageBannerDialog';
import { CreateHomepageBannerDialog } from './_components/CreateHomepageBannerDialog';
import { DeleteBannerAlert } from './_components/DeleteBannerAlert';

export default function AdminOffersAndBannersPage() {
    const firestore = useFirestore();

    const bannersQuery = useMemoFirebase(
      () => (firestore ? query(collection(firestore, 'homepageBanner')) : null),
      [firestore]
    );
  
    const { data: banners, isLoading: isBannerLoading } = useCollection<HomepageBanner>(bannersQuery);
    
    // Offer management logic
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [isOfferEditDialogOpen, setIsOfferEditDialogOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<HomepageBanner | null>(null);
    const [isBannerEditDialogOpen, setIsBannerEditDialogOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<HomepageBanner | null>(null);


    const offersQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'offers')) : null),
        [firestore]
    );

    const { data: offers, isLoading: areOffersLoading } = useCollection<Offer>(offersQuery);

    const handleEditOffer = (offer: Offer) => {
        setSelectedOffer(offer);
        setIsOfferEditDialogOpen(true);
    };

    const handleEditBanner = (banner: HomepageBanner) => {
        setSelectedBanner(banner);
        setIsBannerEditDialogOpen(true);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Offers & Banners</h1>
                <p className="text-muted-foreground">Manage your promotional offers and homepage banner.</p>
            </div>
            
            <Separator />

             <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Homepage Banners</CardTitle>
                        <CardDescription>Manage the rotating banners on your homepage. Only 'active' banners will be shown.</CardDescription>
                    </div>
                     <CreateHomepageBannerDialog>
                        <Button>
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Create Banner
                        </Button>
                    </CreateHomepageBannerDialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isBannerLoading && Array.from({ length: 2 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-32 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                            {banners && banners.map((banner) => {
                                const bannerImage = getImageUrl(banner.imageUrl, 64);
                                return (
                                <TableRow key={banner.id}>
                                    <TableCell>
                                         <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                            {bannerImage ? (
                                                <Image src={bannerImage} alt={banner.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{banner.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={banner.isActive ? 'default' : 'secondary'} size="sm">
                                            {banner.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEditBanner(banner)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => setBannerToDelete(banner)}>
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                     {!isBannerLoading && (!banners || banners.length === 0) && (
                        <div className="flex h-[150px] items-center justify-center text-center">
                             <p className="text-muted-foreground">No banners found.</p>
                             <p className="text-sm text-muted-foreground">Click "Create Banner" to add one.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Special Offers</CardTitle>
                        <CardDescription>A list of all special offers available to apply to products.</CardDescription>
                    </div>
                     <CreateOfferDialog />
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
                            {areOffersLoading && Array.from({ length: 3 }).map((_, i) => (
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
                                        <Badge variant={offer.status === 'active' ? 'default' : 'secondary'} size="sm">
                                            {offer.status}
                                        </Badge>
                                    </TableCell>
                                     <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleEditOffer(offer)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {!areOffersLoading && (!offers || offers.length === 0) && (
                        <div className="flex h-[150px] items-center justify-center text-center">
                            <p className="text-muted-foreground">No offers found. Create one to get started!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedOffer && (
                <EditOfferDialog
                    offer={selectedOffer}
                    isOpen={isOfferEditDialogOpen}
                    onOpenChange={(open) => {
                        setIsOfferEditDialogOpen(open);
                        if (!open) setSelectedOffer(null);
                    }}
                />
            )}
            {selectedBanner && (
                <EditHomepageBannerDialog
                    banner={selectedBanner}
                    isOpen={isBannerEditDialogOpen}
                    onOpenChange={(open) => {
                        setIsBannerEditDialogOpen(open);
                        if (!open) setSelectedBanner(null);
                    }}
                />
            )}
            {bannerToDelete && (
                <DeleteBannerAlert
                    banner={bannerToDelete}
                    isOpen={!!bannerToDelete}
                    onOpenChange={(open) => {
                        if (!open) setBannerToDelete(null);
                    }}
                />
            )}
        </div>
    );
}
