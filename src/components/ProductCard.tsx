
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import React from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const productImage = PlaceHolderImages.find(p => p.id === product.images[0]);
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product, 1);
    }

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <Link href={`/product/${product.id}`} className="group block flex-grow">
            <div className="relative aspect-square w-full">
            {productImage && (
                <Image
                    src={productImage.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    data-ai-hint={productImage.imageHint}
                />
            )}
            </div>
            <CardHeader className="flex-grow">
            <CardTitle className="font-body text-lg leading-tight group-hover:text-primary transition-colors">
                {product.name}
            </CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-xl font-bold text-primary">
                ${product.price.toFixed(2)}
            </p>
            </CardContent>
        </Link>
        <CardFooter className="p-4 pt-0">
            <Button className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </Button>
        </CardFooter>
    </Card>
  );
}
