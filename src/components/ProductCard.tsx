import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const productImage = PlaceHolderImages.find(p => p.id === product.images[0]);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <CardContent className="p-0">
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
        </CardContent>
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
      </Card>
    </Link>
  );
}
