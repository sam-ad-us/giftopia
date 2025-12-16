import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

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
