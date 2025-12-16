
'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Image as ImageIcon } from 'lucide-react';
import { EditHomepageBannerDialog } from './_components/EditHomepageBannerDialog';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { HomepageBanner } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AdminOffersAndBannersPage() {
    const firestore = useFirestore();

    const bannerDocRef = useMemoFirebase(
      () => (firestore ? doc(firestore, 'homepageBanner', 'main-offer') : null),
      [firestore]
    );
  
    const { data: banner, isLoading } = useDoc<HomepageBanner>(bannerDocRef);

    const bannerImage = banner ? PlaceHolderImages.find(p => p.id === banner.imageId) : null;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Offers and Banners</h1>
                    <p className="text-muted-foreground">Manage your promotional offers and banners.</p>
                </div>
                 <EditHomepageBannerDialog>
                    <Button>
                        <Edit className="mr-2 h-5 w-5" />
                        Edit Homepage Banner
                    </Button>
                </EditHomepageBannerDialog>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Homepage Banner Preview</CardTitle>
                    <CardDescription>This is how the banner currently appears on your homepage.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="bg-secondary rounded-lg p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="md:order-2">
                                <Skeleton className="w-full aspect-[4/3]" />
                            </div>
                            <div className="md:order-1 text-center md:text-left">
                                <Skeleton className="h-6 w-24 mb-4" />
                                <Skeleton className="h-10 w-3/4 mb-4" />
                                <Skeleton className="h-5 w-full mb-2" />
                                <Skeleton className="h-5 w-5/6 mb-6" />
                                <Skeleton className="h-12 w-48" />
                            </div>
                        </div>
                    ) : banner && banner.isActive ? (
                        <div className="bg-secondary rounded-lg p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="md:order-2">
                                {bannerImage ? (
                                    <Image 
                                    src={bannerImage.imageUrl}
                                    alt={bannerImage.description}
                                    width={600}
                                    height={450}
                                    className="rounded-lg object-cover w-full h-full"
                                    data-ai-hint={bannerImage.imageHint}
                                    />
                                ) : (
                                    <div className="aspect-[4/3] bg-muted flex items-center justify-center rounded-lg">
                                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="md:order-1 text-center md:text-left">
                            {banner.badgeText && <Badge variant="destructive" className="text-sm py-1 px-3 mb-4">{banner.badgeText}</Badge>}
                            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{banner.title}</h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                {banner.description}
                            </p>
                            <Button asChild size="lg" disabled>
                                <Link href={banner.buttonLink}>
                                    {banner.buttonText}
                                </Link>
                            </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-[200px] flex-col items-center justify-center text-center rounded-lg border-2 border-dashed">
                             <p className="text-muted-foreground">No active banner found.</p>
                             <p className="text-sm text-muted-foreground">Click "Edit Homepage Banner" to create or activate one.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
