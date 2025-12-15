
'use client';

import { useParams, notFound } from 'next/navigation';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Star, StarHalf } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AddToCart from './_components/AddToCart';

function StarRating({ rating, reviewCount }: { rating: number, reviewCount: number }) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="h-5 w-5 fill-primary text-primary" />
                ))}
                {halfStar && <StarHalf className="h-5 w-5 fill-primary text-primary" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="h-5 w-5 text-muted-foreground" />
                ))}
            </div>
            <span className="text-muted-foreground text-sm">({reviewCount} reviews)</span>
        </div>
    );
}

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string | undefined;
  
  const firestore = useFirestore();

  const productRef = useMemoFirebase(
    () => (firestore && productId ? doc(firestore, 'products', productId) : null),
    [firestore, productId]
  );
  
  const { data: product, isLoading } = useDoc<Product>(productRef);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Effect to set the initial active image once the product data is loaded.
  useEffect(() => {
    if (product && product.images.length > 0) {
        const mainProductImage = PlaceHolderImages.find(p => p.id === product.images[0]);
        if (mainProductImage) {
            setActiveImage(mainProductImage.imageUrl);
        }
    }
  }, [product]);

  // Handle loading and not-found states correctly.
  // The hook `useDoc` will have `isLoading = false` and `data = null` if the doc doesn't exist.
  // We also check if a productId is present. If not, it could be an invalid URL.
  if (!productId || (!isLoading && !product)) {
    notFound();
    return null; // Return null to prevent rendering anything further.
  }
  
  // Show skeleton while loading only if we have a productId.
  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  // At this point, `product` is guaranteed to be non-null.
  const productImages = product.images.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);
  const mainImage = activeImage || '';

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="grid gap-4">
                <div className="aspect-square relative rounded-lg overflow-hidden border">
                    {mainImage && (
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {productImages.map((img, index) => img && (
                        <button
                            key={index}
                            className={cn(
                                'aspect-square relative rounded-md overflow-hidden border-2 transition',
                                mainImage === img.imageUrl ? 'border-primary' : 'border-transparent'
                            )}
                            onClick={() => setActiveImage(img.imageUrl)}
                        >
                             <Image
                                src={img.imageUrl}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                data-ai-hint={img.imageHint}
                            />
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col gap-4">
                <h1 className="font-headline text-3xl md:text-4xl font-bold">{product.name}</h1>
                
                <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                    <StarRating rating={product.rating} reviewCount={product.reviews} />
                </div>
                
                <p className="text-muted-foreground">{product.description}</p>
                
                <Separator />

                <AddToCart product={product} />
                
                <div className="prose prose-sm text-foreground max-w-none">
                    <h3 className="font-bold">Product Details</h3>
                    <p>{product.longDescription}</p>
                </div>
            </div>
        </div>
    </div>
  );
}


function ProductPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="grid gap-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="grid grid-cols-5 gap-4">
                        <Skeleton className="aspect-square w-full rounded-md" />
                        <Skeleton className="aspect-square w-full rounded-md" />
                        <Skeleton className="aspect-square w-full rounded-md" />
                        <Skeleton className="aspect-square w-full rounded-md" />
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-10 w-3/4" />
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-10 w-1/4" />
                        <Skeleton className="h-6 w-1/3" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                    <Separator />
                    <Skeleton className="h-12 w-full" />
                    <div className="space-y-4">
                         <Skeleton className="h-6 w-1/4" />
                         <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
