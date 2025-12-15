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
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddProductDialog } from './_components/AddProductDialog';
import { useCollection } from '@/firebase';
import { collection, doc, query, updateDoc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { EditProductDialog } from './_components/EditProductDialog';
import { DeleteProductAlert } from './_components/DeleteProductAlert';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

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
  
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (product: Product) => {
    if (!firestore) return;
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    const productRef = doc(firestore, 'products', product.id);
    try {
      await updateDoc(productRef, { status: newStatus });
      toast({
        title: 'Product Updated',
        description: `${product.name} has been set to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product status.',
        variant: 'destructive',
      });
    }
  };

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
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
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
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell>
                               <Skeleton className="h-8 w-8" />
                            </TableCell>
                        </TableRow>
                    ))}
                    {products && products.map((product) => {
                        const productImage = PlaceHolderImages.find(p => p.id === product.images[0]);
                        return (
                            <TableRow key={product.id} data-state={product.status === 'inactive' ? 'disabled' : ''} className="data-[state=disabled]:opacity-50">
                                <TableCell className="hidden sm:table-cell">
                                    {productImage && (
                                    <Image
                                        alt={product.name}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={productImage.imageUrl}
                                        width="64"
                                        data-ai-hint={productImage.imageHint}
                                    />
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>{product.status}</Badge>
                                </TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem asChild><Link href={`/product/${product.id}`} target="_blank">View</Link></DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEdit(product)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleToggleStatus(product)}>
                                            {product.status === 'active' ? 'Disable' : 'Enable'}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        {selectedProduct && (
          <>
            <EditProductDialog
              product={selectedProduct}
              isOpen={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
            />
            <DeleteProductAlert
              product={selectedProduct}
              isOpen={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            />
          </>
        )}
    </div>
  );
}
