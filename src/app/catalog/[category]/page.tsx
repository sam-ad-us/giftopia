import { categories, products } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categories.find((c) => c.id === params.category);
  const filteredProducts = products.filter((p) => p.category === params.category);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">
        {category.name}
      </h1>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-16">
          No gifts found in this category yet. Check back soon!
        </p>
      )}
    </div>
  );
}
