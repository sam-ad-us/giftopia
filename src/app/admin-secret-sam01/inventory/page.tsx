
'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


export default function AdminInventoryPage() {
    const firestore = useFirestore();
    const [searchQuery, setSearchQuery] = useState('');

    const productsQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'products')) : null),
        [firestore]
    );

    const { data: products, isLoading } = useCollection<Product>(productsQuery);

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        if (!searchQuery) return products;

        const lowercasedQuery = searchQuery.toLowerCase();
        return products.filter(
            (product) =>
                (product.name && product.name.toLowerCase().includes(lowercasedQuery)) ||
                (product.sku && product.sku.toLowerCase().includes(lowercasedQuery))
        );
    }, [products, searchQuery]);
    
    const getStockStatusVariant = (quantity: number) => {
        if (quantity > 10) return 'default';
        if (quantity > 0) return 'secondary';
        return 'destructive';
    };
    
    const getStockStatusText = (quantity: number) => {
        if (quantity > 10) return 'In Stock';
        if (quantity > 0) return 'Low Stock';
        return 'Out of Stock';
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                <p className="text-muted-foreground">Manage stock levels for your products.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Product Stock</CardTitle>
                    <CardDescription>View current stock status and search for products by name or SKU.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products by name or SKU..."
                                className="pl-10 w-full md:w-1/3"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead>Stock Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                </TableRow>
                            ))}
                            {filteredProducts && filteredProducts.map((product) => {
                                const imageUrl = getImageUrl(product.images && product.images[0]);
                                return (
                                <TableRow key={product.id}>
                                    <TableCell>
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
                                    <TableCell className="text-right font-medium">{product.quantity}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStockStatusVariant(product.quantity)}>
                                            {getStockStatusText(product.quantity)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                     {!isLoading && (!filteredProducts || filteredProducts.length === 0) && (
                        <div className="flex h-[150px] items-center justify-center text-center">
                            <p className="text-muted-foreground">{searchQuery ? 'No products found for your search.' : 'No products in inventory.'}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
