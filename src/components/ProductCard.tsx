
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type Offer, type Product } from '@/lib/types';
import { Button } from './ui/button';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn, calculateDiscountedPrice, getOfferText, getImageUrl } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Badge } from './ui/badge';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
    const firestore = useFirestore();
    const router = useRouter();
    const imageUrl = getImageUrl(product.images && product.images[0]);
    const { addToCart } = useCart();
    const { toast } = useToast();
    const isOutOfStock = product.stockStatus === 'out-of-stock' || product.status !== 'active';
    
    const offersQuery = useMemoFirebase(
      () => (firestore ? query(collection(firestore, 'offers')) : null),
      [firestore]
    );
    const { data: offers } = useCollection<Offer>(offersQuery);

    const productOffer = product.offerId ? offers?.find(o => o.id === product.offerId) : null;
    const discountedPrice = calculateDiscountedPrice(product.price, productOffer);
    const hasDiscount = discountedPrice < product.price;

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOutOfStock) {
        toast({
            title: 'Product Unavailable',
            description: 'This product is currently out of stock.',
            variant: 'destructive',
        });
        return;
      }
      addToCart(product, 1, productOffer);
    }

    const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) {
            toast({
                title: 'Product Unavailable',
                description: 'This product is currently out of stock.',
                variant: 'destructive',
            });
            return;
        }
        addToCart(product, 1, productOffer);
        router.push('/checkout');
    }
    
    const handleCardClick = () => {
      onProductClick(product);
    }

  return (
    <Card 
        className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col cursor-pointer"
        onClick={handleCardClick}
    >
        <div className={cn("group block flex-grow", isOutOfStock && "opacity-60")}>
            <div className="relative aspect-square w-full">
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No Image</div>
            )}
            {productOffer && (
                <Badge className="absolute top-2 right-2" variant="destructive">{getOfferText(productOffer)}</Badge>
            )}
            </div>
            <CardHeader className="flex-grow">
            <CardTitle className="font-body text-lg leading-tight group-hover:text-primary transition-colors">
                {product.name}
            </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold text-primary">
                        ₹{discountedPrice.toFixed(2)}
                    </p>
                    {hasDiscount && (
                        <p className="text-sm text-muted-foreground line-through">
                            ₹{product.price.toFixed(2)}
                        </p>
                    )}
                </div>
            </CardContent>
        </div>
        <CardFooter className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-2 w-full">
                <Button 
                    onClick={handleAddToCart}
                    variant={isOutOfStock ? 'secondary' : 'default'}
                    disabled={isOutOfStock}
                    >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                 <Button 
                    onClick={handleBuyNow}
                    variant="secondary"
                    disabled={isOutOfStock}
                    >
                    Buy Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </CardFooter>
    </Card>
  );
}
