'use client';

import { categories } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const firestore = useFirestore();
  const category = categories.find((c) => c.id === params.category);

  const productsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'products'), where('category', '==', params.category))
        : null,
    [firestore, params.category]
  );

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">
        {category.name}
      </h1>
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
             <div className="flex flex-col gap-2" key={i}>
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}
      {!isLoading && products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : !isLoading && (
        <p className="text-center text-muted-foreground py-16">
          No gifts found in this category yet. Check back soon!
        </p>
      )}
    </div>
  );
}
