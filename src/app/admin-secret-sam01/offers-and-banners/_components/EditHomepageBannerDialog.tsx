
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { HomepageBanner } from '@/lib/types';
import { Switch } from '@/components/ui/switch';

const bannerSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  description: z.string().min(10, 'Description is required.'),
  badgeText: z.string().optional(),
  buttonText: z.string().min(3, 'Button text is required.'),
  buttonLink: z.string().url('Must be a valid URL (e.g., /catalog/sale).').or(z.string().startsWith('/', {message: "Must be a valid relative path (e.g., /catalog/sale)."})),
  imageUrl: z.string().url('Please enter a valid ImageKit URL.'),
  isActive: z.boolean().default(true),
});

interface EditHomepageBannerDialogProps {
    children: React.ReactNode;
}

export function EditHomepageBannerDialog({ children }: EditHomepageBannerDialogProps) {
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const bannerDocRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'homepageBanner', 'main-offer') : null),
    [firestore]
  );
  
  const { data: bannerData, isLoading } = useDoc<HomepageBanner>(bannerDocRef);

  const form = useForm<z.infer<typeof bannerSchema>>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
        isActive: true,
    }
  });

  useEffect(() => {
    if (bannerData) {
      form.reset(bannerData);
    } else {
        // Set default values if no data exists, for creation
        form.reset({
            title: 'Eid Special Offer',
            description: 'Celebrate this joyous occasion with our exclusive collection of Eid gifts. Find the perfect presents for your family and friends and enjoy special discounts.',
            badgeText: 'UP TO 30% OFF',
            buttonText: 'Shop The Collection',
            buttonLink: '/catalog/festival-gifts',
            imageUrl: '',
            isActive: true,
        });
    }
  }, [bannerData, form]);

  const onSubmit = async (values: z.infer<typeof bannerSchema>) => {
    if (!firestore || !bannerDocRef) return;
    try {
      // Use setDoc with merge:true to create or update the document
      await setDoc(bannerDocRef, values, { merge: true });
      toast({
        title: 'Banner Updated',
        description: `The homepage banner has been successfully updated.`,
      });
      setOpen(false);
    } catch (error) {
      console.error('Error updating banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update banner. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Homepage Banner</DialogTitle>
          <DialogDescription>Update the content of the main promotional banner on your homepage.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
            <div className="py-4">Loading banner data...</div>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">
                                Show Banner on Homepage
                            </FormLabel>
                            <FormDescription>
                                Turn this off to hide the banner from the homepage.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Summer Sale" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A short, catchy description for the offer." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="badgeText" render={({ field }) => (
                        <FormItem><FormLabel>Badge Text (Optional)</FormLabel><FormControl><Input placeholder="e.g., 30% OFF" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://ik.imagekit.io/..." {...field} /></FormControl><FormDescription className="text-xs">Full URL from ImageKit.</FormDescription><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="buttonText" render={({ field }) => (
                        <FormItem><FormLabel>Button Text</FormLabel><FormControl><Input placeholder="e.g., Shop Now" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="buttonLink" render={({ field }) => (
                        <FormItem><FormLabel>Button Link</FormLabel><FormControl><Input placeholder="/catalog/sale" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                </DialogFooter>
            </form>
            </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
