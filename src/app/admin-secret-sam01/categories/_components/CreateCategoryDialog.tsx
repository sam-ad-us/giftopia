'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const categorySchema = z.object({
  id: z.string().min(3, 'ID must be at least 3 characters.').regex(/^[a-z0-9-]+$/, 'ID must be lowercase with no spaces and only hyphens.'),
  name: z.string().min(3, 'Category name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  imageUrl: z.string().url('Please enter a valid ImageKit URL.'),
  offer: z.string().optional(),
  showInSubHeader: z.boolean().default(false).optional(),
});

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      imageUrl: '',
      offer: '',
      showInSubHeader: false,
    },
  });
  
  const watchedName = form.watch('name');

  const generateIdFromName = (name: string) => {
      return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    if (!firestore) return;
    try {
      const categoryRef = doc(firestore, 'categories', values.id);
      await setDoc(categoryRef, {
        ...values,
        offer: values.offer || null,
      });

      toast({
        title: 'Category Created',
        description: `The category "${values.name}" has been successfully created.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to create category. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>Fill in the details below to create a new product category.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="e.g., Birthday Gifts" 
                        {...field} 
                        onChange={(e) => {
                            field.onChange(e);
                            form.setValue('id', generateIdFromName(e.target.value), { shouldValidate: true });
                        }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., birthday-gifts" {...field} />
                  </FormControl>
                   <FormDescription>This is the unique ID for the category URL (auto-generated from name).</FormDescription>
                   <FormMessage />
                </FormItem>
              )}
            />
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://ik.imagekit.io/..." {...field} />
                  </FormControl>
                   <FormDescription>Full URL of the image from ImageKit.</FormDescription>
                   <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="offer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Text (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Up to 20% Off" {...field} />
                  </FormControl>
                   <FormDescription>A small badge of text that appears on the category image.</FormDescription>
                   <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="showInSubHeader"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Show in Sub-header
                    </FormLabel>
                    <FormDescription>
                      If checked, this category will appear in the navigation sub-header.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
