
'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Truck, ShieldCheck, Zap } from 'lucide-react';
import AddToCart from './_components/AddToCart';
import {
  ImagePlaceholder,
  PlaceHolderImages,
} from '@/lib/placeholder-images';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex gap-4 sticky top-24 self-start">
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-16 rounded-md" />
              ))}
            </div>
            <div className="flex-1">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="flex items-center gap-2 mt-4">
                <Skeleton className="h-12 flex-grow" />
                <Skeleton className="h-12 flex-grow" />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-10 w-3/4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-12 w-1/4" />
          <Separator />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
          <Separator />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
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
  const { data: product, isLoading, error } = useDoc<Product>(productRef);

  const [productImages, setProductImages] = useState<ImagePlaceholder[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImagePlaceholder | null>(
    null
  );

  useEffect(() => {
    if (product?.images) {
      const images = product.images
        .map((id) => PlaceHolderImages.find((p) => p.id === id))
        .filter((p): p is ImagePlaceholder => Boolean(p));
      setProductImages(images);
      if (images.length > 0) {
        setSelectedImage(images[0]);
      }
    }
  }, [product]);

  if (isLoading || !productId) {
    return <ProductPageSkeleton />;
  }

  if (!product && !isLoading) {
    notFound();
    return null;
  }

  if (!product) {
    return <ProductPageSkeleton />;
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex gap-4 sticky top-24 self-start">
              {productImages.length > 1 && (
                <div className="hidden sm:flex flex-col gap-2">
                  {productImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`w-16 h-16 relative rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage?.id === image.id
                          ? 'border-primary ring-2 ring-primary/50'
                          : 'border-border hover:border-muted-foreground/50'
                      }`}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover"
                        sizes="10vw"
                        data-ai-hint={image.imageHint}
                      />
                    </button>
                  ))}
                </div>
              )}
              <div className="flex-1">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      {selectedImage ? (
                        <Image
                          src={selectedImage.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 40vw"
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
                <div className="flex items-center gap-2 mt-4">
                  <AddToCart product={product} />
                  <Button
                    size="lg"
                    className="w-full h-12 text-base bg-accent hover:bg-accent/90"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground mb-2">
                Home &gt; Gifts &gt; {product.category}
              </p>
              <h1 className="font-headline text-3xl lg:text-4xl font-bold">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-sm flex items-center gap-1">
                    {product.rating.toFixed(1)} <Star className="h-3 w-3" />
                  </span>
                  <span className="text-muted-foreground text-sm">
                    ({product.reviews} ratings)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Giftopia Assured</span>
                </div>
              </div>

              <div className="my-2">
                <p className="text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-muted-foreground line-through">
                    ${(product.price * 1.3).toFixed(2)}
                  </p>
                  <p className="text-green-600 font-semibold">30% off</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Free Delivery</p>
                    <p className="text-muted-foreground">Get it by tomorrow</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Genuine Product</p>
                    <p className="text-muted-foreground">
                      Quality checked & assured
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-bold text-lg mb-2">
                  Product Description
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {product.longDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
