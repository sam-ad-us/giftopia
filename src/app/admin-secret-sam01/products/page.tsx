
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddProductDialog } from './_components/AddProductDialog';
import { useCollection } from '@/firebase';
import { collection, doc, query, updateDoc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { Product, Offer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { EditProductDialog } from './_components/EditProductDialog';
import { DeleteProductAlert } from './_components/DeleteProductAlert';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/lib/utils';

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const productsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products')) : null),
    [firestore]
  );
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const offersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'offers')) : null),
    [firestore]
  );
  const { data: offers, isLoading: isLoadingOffers } = useCollection<Offer>(offersQuery);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };
  
  const isLoading = isLoadingProducts || isLoadingOffers;

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">Manage the products in your gift shop.</p>
            </div>
            <AddProductDialog />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>A list of all products in your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Offer</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({length: 5}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="hidden sm:table-cell">
                                <Skeleton className="h-16 w-16 rounded-md" />
                            </TableCell>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                            <TableCell>
                               <Skeleton className="h-8 w-8" />
                            </TableCell>
                        </TableRow>
                    ))}
                    {products && products.map((product) => {
                        const imageUrl = getImageUrl(product.images && product.images[0]);
                        const offer = offers?.find(o => o.id === product.offerId);
                        return (
                            <TableRow key={product.id} data-state={product.status === 'inactive' ? 'disabled' : ''} className="data-[state=disabled]:opacity-50">
                                <TableCell className="hidden sm:table-cell">
                                    {imageUrl ? (
                                    <Image
                                        alt={product.name}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={imageUrl}
                                        width="64"
                                    />
                                    ) : (
                                        <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                                <TableCell>
                                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'} size="sm">{product.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    {offer ? <Badge variant="destructive" size="sm">{offer.name}</Badge> : <span className="text-muted-foreground text-xs">N/A</span>}
                                </TableCell>
                                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                </Table>
                 {!isLoading && (!products || products.length === 0) && (
                    <div className="flex h-[150px] items-center justify-center text-center">
                        <p className="text-muted-foreground">No products found. Create one to get started!</p>
                    </div>
                )}
            </CardContent>
        </Card>
        
        {selectedProduct && (
          <>
            <EditProductDialog
              product={selectedProduct}
              isOpen={isEditDialogOpen}
              onOpenChange={(open) => {
                setIsEditDialogOpen(open);
                if (!open) setSelectedProduct(null);
              }}
            />
            {/* The DeleteProductAlert can be triggered from within the Edit dialog if needed */}
          </>
        )}
    </div>
  );
}
