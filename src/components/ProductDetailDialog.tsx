'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Product } from '@/lib/types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Star, StarHalf, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartContext';
import { Separator } from './ui/separator';

interface ProductDetailDialogProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

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


export function ProductDetailDialog({ product, isOpen, onOpenChange }: ProductDetailDialogProps) {
    const { addToCart } = useCart();
    const [activeImage, setActiveImage] = useState<string | null>(null);

    useEffect(() => {
        if (product && product.images.length > 0) {
            const mainProductImage = PlaceHolderImages.find(p => p.id === product.images[0]);
            if (mainProductImage) {
                setActiveImage(mainProductImage.imageUrl);
            }
        }
    }, [product]);

    if (!product) return null;

    const productImages = product.images.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);
    const mainImage = activeImage || (productImages[0]?.imageUrl || '');

    const handleAddToCart = () => {
        addToCart(product, 1);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] grid grid-cols-1 md:grid-cols-2 gap-8 p-0 overflow-y-auto">
                 {/* Image Gallery */}
                <div className="flex flex-col gap-4 p-6">
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
                <div className="flex flex-col gap-4 p-6 pr-8">
                    <h1 className="font-headline text-3xl md:text-4xl font-bold">{product.name}</h1>
                    
                    <div className="flex items-center justify-between">
                        <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                        <StarRating rating={product.rating} reviewCount={product.reviews} />
                    </div>
                    
                    <p className="text-muted-foreground">{product.description}</p>
                    
                    <Separator />

                    <Button
                        size="lg"
                        onClick={handleAddToCart}
                        className="w-full h-12 text-base"
                        disabled={product.stockStatus === 'out-of-stock' || product.status !== 'active'}
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {product.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    
                    <div className="prose prose-sm text-foreground max-w-none">
                        <h3 className="font-bold">Product Details</h3>
                        <p>{product.longDescription}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
