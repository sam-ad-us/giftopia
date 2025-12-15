
'use client';

import { useParams } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string | undefined;

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold">Product Page Under Construction</h1>
      <p className="text-muted-foreground mt-2">
        This page for product ID: {productId} is currently being rebuilt.
      </p>
    </div>
  );
}
