'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, PlusCircle, MoreHorizontal } from 'lucide-react';
import { products } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const ADMIN_EMAIL = 'admin-sam@giftopia.com';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If auth state is still loading, do nothing yet.
    if (isUserLoading) {
      return;
    }

    // If loading is finished and there's no user, redirect to admin login.
    if (!user) {
      router.replace('/admin-secret-sam01/login');
      return;
    }

    // If a user is logged in, check if they are the admin.
    if (user.email !== ADMIN_EMAIL) {
      // If not the admin, redirect to the homepage.
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  // While loading or if redirection is in progress, show a loading state.
  if (isUserLoading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Card className="w-full max-w-md">
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  // If the user is the admin, show the admin content.
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <Shield className="h-10 w-10 text-primary" />
            <div>
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Admin Panel</h1>
                <p className="text-muted-foreground">Welcome, {user.displayName || user.email}.</p>
            </div>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
          <CardDescription>View, edit, and manage all products in the store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">
                  Price
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const productImage = PlaceHolderImages.find(p => p.id === product.images[0]);
                return (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    {productImage && (
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                            src={productImage.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            data-ai-hint={productImage.imageHint}
                        />
                        </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
