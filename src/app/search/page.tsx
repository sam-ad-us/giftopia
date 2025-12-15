'use client';

import { useSearchParams } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchInput } from '@/components/SearchInput';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { ProductDetailDialog } from '@/components/ProductDetailDialog';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const firestore = useFirestore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const productsQuery = useMemoFirebase(
    () => {
        if (!firestore || !q) return null;
        // Firestore doesn't support case-insensitive 'contains' queries natively.
        // A common approach is to store searchable fields in a standardized format (e.g., all lowercase).
        // This query assumes such a field `searchableName` exists.
        // For this implementation, we will query for products that have a name greater than or equal to the query.
        // This is a limitation of Firestore, and for real-world applications, a dedicated search service like Algolia is recommended.
        
        // A simple query to demonstrate functionality.
        return query(
            collection(firestore, 'products'), 
            where('name', '>=', q),
            where('name', '<=', q + '\uf8ff')
        );
    },
    [firestore, q]
  );

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-xl mx-auto mb-8 sm:hidden">
          <SearchInput />
      </div>
      <div className="mb-8">
        {q ? (
          <>
            <h1 className="font-headline text-3xl md:text-4xl font-bold">
              Search results for "{q}"
            </h1>
            {!isLoading && products && (
                 <p className="text-muted-foreground mt-2">{products.length} {products.length === 1 ? 'result' : 'results'} found.</p>
            )}
          </>
        ) : (
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-center">
            Search for your perfect gift
          </h1>
        )}
      </div>

      {isLoading && q && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="flex flex-col gap-2" key={i}>
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && q && products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} />
          ))}
        </div>
      )}

      {!isLoading && q && (!products || products.length === 0) && (
        <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No results found</h2>
          <p className="text-muted-foreground mt-2">
            We couldn't find any gifts matching your search. Try a different keyword.
          </p>
        </div>
      )}

       {!q && !isLoading && (
         <div className="text-center py-16">
            <p className="text-muted-foreground">
                Type in the search bar above to find gifts by name.
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
