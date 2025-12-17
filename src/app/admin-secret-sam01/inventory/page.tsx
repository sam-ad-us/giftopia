
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type StatusFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
type SortBy = 'name-asc' | 'name-desc' | 'quantity-asc' | 'quantity-desc';

export default function AdminInventoryPage() {
    const firestore = useFirestore();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [sortBy, setSortBy] = useState<SortBy>('name-asc');

    const productsQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'products')) : null),
        [firestore]
    );

    const { data: products, isLoading } = useCollection<Product>(productsQuery);

    const filteredAndSortedProducts = useMemo(() => {
        if (!products) return [];

        // Filter logic
        let filtered = products.filter(product => {
            const lowercasedQuery = searchQuery.toLowerCase();
            const nameMatch = product.name?.toLowerCase().includes(lowercasedQuery);
            const skuMatch = product.sku?.toLowerCase().includes(lowercasedQuery);
            
            const statusMatch = () => {
                if (statusFilter === 'all') return true;
                if (statusFilter === 'in-stock') return product.quantity > 10;
                if (statusFilter === 'low-stock') return product.quantity > 0 && product.quantity <= 10;
                if (statusFilter === 'out-of-stock') return product.quantity === 0;
                return true;
            };

            return (nameMatch || skuMatch) && statusMatch();
        });

        // Sorting logic
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'quantity-asc':
                    return a.quantity - b.quantity;
                case 'quantity-desc':
                    return b.quantity - a.quantity;
                default:
                    return 0;
            }
        });
        
        return filtered;

    }, [products, searchQuery, statusFilter, sortBy]);
    
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
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products by name or SKU..."
                                className="pl-10 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="in-stock">In Stock</SelectItem>
                                    <SelectItem value="low-stock">Low Stock</SelectItem>
                                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                                    <SelectItem value="quantity-desc">Quantity: High to Low</SelectItem>
                                    <SelectItem value="quantity-asc">Quantity: Low to High</SelectItem>
                                </SelectContent>
                            </Select>
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
                            {filteredAndSortedProducts && filteredAndSortedProducts.map((product) => {
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
                     {!isLoading && (!filteredAndSortedProducts || filteredAndSortedProducts.length === 0) && (
                        <div className="flex h-[150px] items-center justify-center text-center">
                            <p className="text-muted-foreground">{searchQuery || statusFilter !== 'all' ? 'No products found for your criteria.' : 'No products in inventory.'}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
