import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import AddToCart from './_components/AddToCart';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }
  
  const productImages = product.images.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {productImages.map((image, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        {image && (
                           <Image
                            src={image.imageUrl}
                            alt={`${product.name} - image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            data-ai-hint={image.imageHint}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-headline text-4xl lg:text-5xl font-bold">{product.name}</h1>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
          </div>

          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <p className="text-lg text-muted-foreground">{product.longDescription}</p>

          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
