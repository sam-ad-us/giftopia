
'use client';

import { categories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CatalogPage() {
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
        {categories.map((category) => {
          const categoryImage = PlaceHolderImages.find((p) => p.id === category.image);
          return (
            <Link key={category.id} href={`/catalog/${category.id}`} className="group">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0">
                <CardContent className="p-0 relative">
                  <div className="relative aspect-square">
                    {categoryImage && (
                      <Image
                        src={categoryImage.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={categoryImage.imageHint}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
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
    </div>
  );
}
