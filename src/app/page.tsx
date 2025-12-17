
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { HomepageBanner, Product, Category } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ProductCard from '@/components/ProductCard';
import { useState, useRef, useEffect } from 'react';
import { ProductDetailDialog } from '@/components/ProductDetailDialog';
import { getImageUrl } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';

function SpecialOfferProductsSection() {
    const firestore = useFirestore();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const plugin = useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    const offersQuery = useMemoFirebase(
      () => (firestore ? query(collection(firestore, 'products'), where('offerId', '!=', null)) : null),
      [firestore]
    );

    const { data: products, isLoading } = useCollection<Product>(offersQuery);

    if (isLoading) {
      return (
          <section id="special-offer-products" className="py-6 md:py-8 bg-background">
              <div className="container mx-auto px-4">
                  <Skeleton className="h-10 w-1/2 mx-auto mb-12" />
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                      {Array.from({ length: 5 }).map((_, i) => (
                          <div className="flex flex-col gap-2" key={i}>
                              <Skeleton className="aspect-square w-full" />
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-8 w-1/2" />
                              <Skeleton className="h-10 w-full" />
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      );
    }
    
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section id="special-offer-products" className="py-6 md:py-8 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">
                        Special Offers
                    </h2>
                    <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Don't miss out on these limited-time deals!</p>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    className="w-full"
                >
                    <CarouselContent>
                        {products.map((product) => (
                            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/5">
                                <div className="p-1 h-full">
                                    <ProductCard product={product} onProductClick={setSelectedProduct} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
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
        </section>
    );
}

function SpecialOfferSection() {
    const firestore = useFirestore();
    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true, playOnInit: true }));

    const bannersQuery = useMemoFirebase(
      () => (firestore ? query(collection(firestore, 'homepageBanner'), where('isActive', '==', true)) : null),
      [firestore]
    );
  
    const { data: banners, isLoading } = useCollection<HomepageBanner>(bannersQuery);

    if (isLoading) {
        return (
            <section id="special-offer" className="py-6 md:py-8 bg-background">
                <div className="container mx-auto px-4">
                    <div className="bg-secondary rounded-lg p-8 md:p-12">
                        <Skeleton className="w-full aspect-[16/6]" />
                    </div>
                </div>
            </section>
        )
    }

    if (!banners || banners.length === 0) {
        return null; // Don't render the section if there's no active banner
    }

    return (
        <section id="special-offer" className="py-6 md:py-8 bg-background">
            <div className="container mx-auto px-4">
                 <div className="px-0 md:px-12">
                     <Carousel
                        opts={{ align: "start", loop: true }}
                        plugins={[plugin.current]}
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                        className="w-full"
                    >
                        <CarouselContent>
                        {banners.map((banner) => {
                                const bannerImage = getImageUrl(banner.imageUrl, 600);
                                return (
                                    <CarouselItem key={banner.id}>
                                        <div className="bg-secondary rounded-lg p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-[450px]">
                                            <div className="md:order-2 h-full w-full relative">
                                            {bannerImage && (
                                                <Image 
                                                src={bannerImage}
                                                alt={banner.title}
                                                fill
                                                className="rounded-lg object-cover"
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
                                    </CarouselItem>
                                )
                        })}
                        </CarouselContent>
                        <CarouselPrevious className="left-[-1rem] md:left-[-2rem]" />
                        <CarouselNext className="right-[-1rem] md:right-[-2rem]" />
                    </Carousel>
                </div>
            </div>
      </section>
    )
}

function CategorySection() {
    const firestore = useFirestore();
    const categoriesQuery = useMemoFirebase(
      () => (firestore ? query(collection(firestore, 'categories')) : null),
      [firestore]
    );
    const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

    return (
        <section id="categories" className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Gifts by Category
            </h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Find the perfect present by exploring our thoughtfully selected categories.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading && Array.from({length: 8}).map((_, i) => (
                <Card key={i} className="overflow-hidden border-0">
                    <CardContent className="p-0 relative">
                        <div className="relative aspect-square">
                            <Skeleton className="w-full h-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
            {categories && categories.map((category) => {
              const categoryImage = getImageUrl(category.imageUrl, 400);
              return (
              <Link key={category.id} href={`/catalog/${category.id}`} className="group">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0">
                  <CardContent className="p-0 relative">
                    <div className="relative aspect-square">
                      {categoryImage && (
                        <Image
                          src={categoryImage}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
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
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
                <Link href="/catalog">
                    View All Categories
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
          </div>
        </div>
      </section>
    )
}

export default function Home() {
  const firestore = useFirestore();
  const bannersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'homepageBanner'), where('isActive', '==', true)) : null),
    [firestore]
  );
  const { data: banners, isLoading } = useCollection<HomepageBanner>(bannersQuery);
  
  const [heroImage, setHeroImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (banners && banners.length > 0) {
      // Use the image from the first active banner for the main hero section
      setHeroImage(getImageUrl(banners[0].imageUrl, 1920));
    }
  }, [banners]);


  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center text-center text-white">
        {isLoading ? (
          <Skeleton className="absolute inset-0" />
        ) : heroImage ? (
           <Image
            src={heroImage}
            alt={banners?.[0]?.title || "A beautifully wrapped gift box"}
            fill
            className="object-cover"
            priority
          />
        ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-deeper"></div>
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

      <SpecialOfferProductsSection />

      <CategorySection />

    </div>
  );
}
