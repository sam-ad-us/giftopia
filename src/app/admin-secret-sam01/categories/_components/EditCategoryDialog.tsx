'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Trash } from 'lucide-react';
import { DeleteCategoryAlert } from './DeleteCategoryAlert';

const categorySchema = z.object({
  name: z.string().min(3, 'Category name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  image: z.string().min(1, 'Image ID is required.'),
});


interface EditCategoryDialogProps {
  category: Category;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({ category, isOpen, onOpenChange }: EditCategoryDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: category,
  });

  useEffect(() => {
    if (category) {
      form.reset(category);
    }
  }, [category, form]);

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    if (!firestore || !category.id) return;
    try {
      const categoryRef = doc(firestore, 'categories', category.id);
      await updateDoc(categoryRef, values);
      toast({
        title: 'Category Updated',
        description: `The category "${values.name}" has been successfully updated.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update the details for this product category.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Anniversary Gifts" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
                <FormLabel>Category ID</FormLabel>
                <FormControl>
                    <Input disabled value={category.id} />
                </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short description of the category." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., cat-anniversary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="grid grid-cols-2 gap-2 sm:space-x-0">
                <Button variant="destructive" type="button" onClick={() => setIsDeleteDialogOpen(true)} className="sm:justify-start">
                    <Trash className="mr-2" />
                    Delete
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting} className="sm:justify-end">
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    <DeleteCategoryAlert 
        category={category}
        isOpen={isDeleteDialogOpen}
        onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) {
                // If the delete dialog is closed without deleting, we also close the edit dialog
                onOpenChange(false);
            }
        }}
    />
    </>
  );
}
