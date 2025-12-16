
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { HomepageBanner } from '@/lib/types';


function SpecialOfferSection() {
    const firestore = useFirestore();

    const bannerDocRef = useMemoFirebase(
      () => (firestore ? doc(firestore, 'homepageBanner', 'main-offer') : null),
      [firestore]
    );
  
    const { data: banner, isLoading } = useDoc<HomepageBanner>(bannerDocRef);

    if (isLoading) {
        return (
            <section id="special-offer" className="py-12 md:py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="bg-secondary rounded-lg p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="md:order-2">
                             <Skeleton className="w-full aspect-[4/3]" />
                        </div>
                        <div className="md:order-1 text-center md:text-left">
                            <Skeleton className="h-6 w-24 mb-4" />
                            <Skeleton className="h-10 w-3/4 mb-4" />
                            <Skeleton className="h-5 w-full mb-2" />
                            <Skeleton className="h-5 w-5/6 mb-6" />
                            <Skeleton className="h-12 w-48" />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (!banner || !banner.isActive) {
        return null; // Don't render the section if there's no active banner
    }

    const bannerImage = PlaceHolderImages.find(p => p.id === banner.imageId);

    return (
        <section id="special-offer" className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-secondary rounded-lg p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              {bannerImage && (
                <Image 
                  src={bannerImage.imageUrl}
                  alt={bannerImage.description}
                  width={600}
                  height={450}
                  className="rounded-lg object-cover w-full h-full"
                  data-ai-hint={bannerImage.imageHint}
                />
              )}
            </div>
            <div className="md:order-1 text-center md:text-left">
              {banner.badgeText && <Badge variant="destructive" className="text-sm py-1 px-3 mb-4">{banner.badgeText}</Badge>}
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{banner.title}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {banner.description}
              </p>
              <Button asChild size="lg">
                <Link href={banner.buttonLink}>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {banner.buttonText}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
}

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center text-center text-white">
        {heroImage && (
           <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-shadow-lg">
            The Perfect Gift for Every Occasion
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-shadow">
            Discover a curated collection of unique gifts that will make your loved ones feel special, cherished, and remembered forever.
          </p>
          <Button asChild size="lg" className="font-bold text-lg px-8 py-6">
            <Link href="#categories">
              Start Gifting <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <SpecialOfferSection />

      <section id="categories" className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Gifts by Category
            </h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Find the perfect present by exploring our thoughtfully selected categories.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const categoryImage = PlaceHolderImages.find(p => p.id === category.image);
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
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                    {category.offer && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">{category.offer}</Badge>
                    )}
                    <div className="absolute bottom-0 p-4">
                      <h3 className="font-headline text-2xl font-bold text-white">{category.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )})}
          </div>
        </div>
      </section>
    </div>
  );
}
