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
import { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { CreateCategoryDialog } from './_components/CreateCategoryDialog';
import { EditCategoryDialog } from './_components/EditCategoryDialog';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

export default function AdminCategoriesPage() {
    const firestore = useFirestore();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const categoriesQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'categories')) : null),
        [firestore]
    );

    const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditDialogOpen(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Manage your product categories.</p>
                </div>
                <CreateCategoryDialog />
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>A list of all product categories in your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Offer</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                </TableRow>
                            ))}
                            {categories && categories.map((category) => {
                                const categoryImage = PlaceHolderImages.find((p) => p.id === category.image);
                                return (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <div className="relative">
                                            {categoryImage ? (
                                                <Image
                                                    alt={category.name}
                                                    className="aspect-square rounded-md object-cover"
                                                    height="64"
                                                    src={categoryImage.imageUrl}
                                                    width="64"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                            )}
                                            {category.offer && <Badge className="absolute -top-2 -right-3">{category.offer}</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="font-mono text-xs">{category.id}</TableCell>
                                    <TableCell className="text-muted-foreground max-w-[200px] truncate">{category.description}</TableCell>
                                    <TableCell className="text-muted-foreground">{category.offer || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                     {!isLoading && (!categories || categories.length === 0) && (
                        <div className="flex h-[150px] items-center justify-center text-center">
                            <p className="text-muted-foreground">No categories found. Create one to get started!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
             {selectedCategory && (
                <EditCategoryDialog
                    category={selectedCategory}
                    isOpen={isEditDialogOpen}
                    onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) setSelectedCategory(null);
                    }}
                />
            )}
        </div>
    );
}
