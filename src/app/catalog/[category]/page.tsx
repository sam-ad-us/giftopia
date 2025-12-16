'use client';

import ProductCard from '@/components/ProductCard';
import { notFound, useParams } from 'next/navigation';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { Product, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { ProductDetailDialog } from '@/components/ProductDetailDialog';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const firestore = useFirestore();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categoryDocRef = useMemoFirebase(
    () => (firestore && categoryId ? doc(firestore, 'categories', categoryId) : null),
    [firestore, categoryId]
  );
  const { data: category, isLoading: isCategoryLoading } = useDoc<Category>(categoryDocRef);

  const productsQuery = useMemoFirebase(
    () =>
      firestore && categoryId
        ? query(collection(firestore, 'products'), where('category', '==', categoryId), where('status', '==', 'active'))
        : null,
    [firestore, categoryId]
  );

  const { data: products, isLoading: areProductsLoading } = useCollection<Product>(productsQuery);
  
  const isLoading = isCategoryLoading || areProductsLoading;

  // If loading is finished and the category document doesn't exist, show a 404 page.
  if (!isLoading && !category) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {isLoading ? (
        <>
          <Skeleton className="h-12 w-1/3 mb-8" />
          <Skeleton className="h-6 w-1/2 mb-12" />
        </>
      ) : (
        <div className="mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            {category?.name}
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl">
            {category?.description}
          </p>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
             <div className="flex flex-col gap-2" key={i}>
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4 mt-2" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <h2 className="text-2xl font-semibold">Coming Soon!</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            No gifts have been added to the "{category?.name}" category yet. Please check back later!
          </p>
        </div>
      )}

      {selectedProduct && (
          <ProductDetailDialog 
            product={selectedProduct} 
            isOpen={!!selectedProduct} 
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setSelectedProduct(null);
              }
            }} 
          />
        )}
    </div>
  );
}
