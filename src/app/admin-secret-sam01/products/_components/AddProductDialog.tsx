
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDoc, collection, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Offer, Category } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  sku: z.string().min(3, 'SKU is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  longDescription: z.string().min(20, 'Long description must be at least 20 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  category: z.string({ required_error: 'Please select a category.' }),
  offerId: z.string().optional(),
  images: z.string().min(1, "Please provide at least one image ID or URL."),
  quantity: z.coerce.number().min(0, "Quantity can't be negative."),
  status: z.enum(['active', 'inactive']).default('active'),
});

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const offersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'offers'), where('status', '==', 'active')) : null),
    [firestore]
  );
  const { data: offers } = useCollection<Offer>(offersQuery);
  
  const categoriesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'categories')) : null),
    [firestore]
  );
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);


  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      longDescription: '',
      price: 0,
      category: '',
      offerId: 'none',
      images: '',
      quantity: 100,
      status: 'active',
    },
  });

  const watchedName = form.watch('name');
  const watchedCategory = form.watch('category');

  useEffect(() => {
    const generateSku = () => {
        if (!watchedCategory || !watchedName) {
            form.setValue('sku', '');
            return;
        };
        const categoryPrefix = categories?.find(c => c.id === watchedCategory)?.name.substring(0, 3).toUpperCase() || 'GEN';
        const namePart = watchedName.trim().replace(/\s+/g, '-').substring(0, 10).toUpperCase();
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        form.setValue('sku', `${categoryPrefix}-${namePart}-${randomSuffix}`);
    };
    generateSku();
  }, [watchedName, watchedCategory, categories, form]);

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    if (!firestore) return;
    try {
        const productData = {
            ...values,
            images: values.images.split(',').map(s => s.trim()), // Simple comma-separated string to array
            rating: 0, // Default value
            reviews: 0, // Default value
            offerId: values.offerId === 'none' ? null : values.offerId,
        };
      await addDoc(collection(firestore, 'products'), productData);
      toast({
        title: 'Product Added',
        description: `${values.name} has been added to the store.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
    const getOfferText = (offer: Offer) => {
        if (offer.type === 'percentage') {
            return `${offer.name} (${offer.value}% off)`;
        }
        return `${offer.name} (₹${offer.value} off)`;
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Fill in the details below to add a new product to your store.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Artisan Chocolate Box" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCategories}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select a category"} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories?.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                            <Input placeholder="Auto-generated" {...field} readOnly className="bg-muted" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief summary of the product." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A detailed description for the product page." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="25.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                <FormField
                    control={form.control}
                    name="offerId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Offer (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an offer" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="none">No Offer</SelectItem>
                                {offers?.map(offer => (
                                    <SelectItem key={offer.id} value={offer.id}>{getOfferText(offer)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
             
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <Input placeholder="image.jpg, another.png, https://.../image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of ImageKit filenames or full URLs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Initial Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="active" />
                          </FormControl>
                          <FormLabel className="font-normal">Active</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="inactive" />
                          </FormControl>
                          <FormLabel className="font-normal">Inactive</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Adding...' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
