'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Star, Truck, ShieldCheck, Tag } from 'lucide-react';
import AddToCart from './_components/AddToCart';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ProductPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const productRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'products', params.id) : null),
    [firestore, params.id]
  );
  const { data: product, isLoading } = useDoc<Product>(productRef);

  const [productImages, setProductImages] = useState<ImagePlaceholder[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImagePlaceholder | null>(null);

  useEffect(() => {
    if (product) {
      const images = product.images.map(id => PlaceHolderImages.find(p => p.id === id)).filter((p): p is ImagePlaceholder => Boolean(p));
      setProductImages(images);
      if (images.length > 0) {
        setSelectedImage(images[0]);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col gap-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-5 flex flex-col gap-4 sticky top-24 self-start">
             <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="aspect-square relative">
                        {selectedImage ? (
                        <Image
                            src={selectedImage.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            data-ai-hint={selectedImage.imageHint}
                            priority
                        />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">No Image</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-5 gap-2">
              {productImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square relative rounded-md overflow-hidden border-2 ${selectedImage?.id === image.id ? 'border-primary' : 'border-transparent'}`}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    sizes="20vw"
                    data-ai-hint={image.imageHint}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
                <AddToCart product={product} />
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90" onClick={() => {
                    // This would typically add to cart and then redirect to checkout
                    console.log('Buy Now clicked');
                }}>
                    Buy Now
                </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-7">
            <Card className="p-6">
                 <p className="text-sm text-muted-foreground mb-2">Home &gt; Gifts &gt; {product.category}</p>
                <h1 className="font-headline text-3xl lg:text-4xl font-bold">{product.name}</h1>
                <p className="text-muted-foreground mt-1">{product.description}</p>
                
                <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                        <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-sm flex items-center gap-1">
                            {product.rating.toFixed(1)} <Star className="h-3 w-3" />
                        </span>
                        <span className="text-muted-foreground text-sm">({product.reviews} ratings)</span>
                    </div>
                     <div className="flex items-center gap-2 text-sm text-green-600">
                        <ShieldCheck className="w-4 h-4"/>
                        <span>Giftopia Assured</span>
                    </div>
                </div>

                <div className="my-6">
                    <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-muted-foreground line-through">${(product.price * 1.3).toFixed(2)}</p>
                        <p className="text-green-600 font-semibold">30% off</p>
                    </div>
                </div>

                <div className="space-y-4 my-6">
                    <h3 className="font-bold text-lg">Available Offers</h3>
                     <div className="flex items-start gap-3 text-sm">
                        <Tag className="h-5 w-5 mt-0.5 text-primary"/>
                        <div>
                            <span className="font-semibold">Bank Offer</span> 10% off on ICICI Bank Cards
                            <span className="text-primary hover:underline cursor-pointer ml-1">T&C</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                        <Tag className="h-5 w-5 mt-0.5 text-primary"/>
                        <div>
                            <span className="font-semibold">Special Offer</span> Get extra 5% off
                            <span className="text-primary hover:underline cursor-pointer ml-1">T&C</span>
                        </div>
                    </div>
                </div>
                
                <Separator className="my-6" />

                <div className="grid grid-cols-2 gap-6 text-sm">
                     <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">Free Delivery</p>
                            <p className="text-muted-foreground">Get it by tomorrow</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">Genuine Product</p>
                            <p className="text-muted-foreground">Quality checked & assured</p>
                        </div>
                    </div>
                </div>

                 <Separator className="my-6" />

                 <div>
                    <h3 className="font-bold text-lg mb-2">Product Description</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{product.longDescription}</p>
                 </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
