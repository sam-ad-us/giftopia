'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function CatalogPage() {
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'categories')) : null),
    [firestore]
  );
  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          All Categories
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Explore all our gift categories to find the perfect present for any occasion.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-0">
                <CardContent className="p-0 relative">
                    <div className="relative aspect-square">
                        <Skeleton className="w-full h-full" />
                    </div>
                </CardContent>
            </Card>
          ))}
        {!isLoading && categories?.map((category) => {
          const categoryImage = PlaceHolderImages.find((p) => p.id === category.image);
          return (
            <Link key={category.id} href={`/catalog/${category.id}`} className="group">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0">
                <CardContent className="p-0 relative">
                  <div className="relative aspect-square">
                    {categoryImage ? (
                      <Image
                        src={categoryImage.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={categoryImage.imageHint}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground text-xs">No image</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  {category.offer && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                      {category.offer}
                    </Badge>
                  )}
                  <div className="absolute bottom-0 p-4">
                    <h3 className="font-headline text-2xl font-bold text-white">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
       {!isLoading && (!categories || categories.length === 0) && (
        <div className="flex h-[150px] items-center justify-center text-center">
            <p className="text-muted-foreground">No categories found. The admin can add some!</p>
        </div>
      )}
    </div>
  );
}
