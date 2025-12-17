
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
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
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

interface CreateHomepageBannerDialogProps {
    children: React.ReactNode;
}

export function CreateHomepageBannerDialog({ children }: CreateHomepageBannerDialogProps) {
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bannerSchema>>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
        title: 'New Special Offer',
        description: 'A great new deal for our customers.',
        badgeText: '',
        buttonText: 'Shop Now',
        buttonLink: '/catalog',
        imageUrl: '',
        isActive: true,
    }
  });

  const onSubmit = async (values: z.infer<typeof bannerSchema>) => {
    if (!firestore) return;
    try {
      await addDoc(collection(firestore, 'homepageBanner'), {
        ...values,
        badgeText: values.badgeText || null
      });
      toast({
        title: 'Banner Created',
        description: `The new banner has been successfully created.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to create banner. Please try again.',
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
          <DialogTitle>Create New Homepage Banner</DialogTitle>
          <DialogDescription>Fill in the details for the new promotional banner.</DialogDescription>
        </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">
                                Activate Banner
                            </FormLabel>
                            <FormDescription>
                                Set this banner to active to show it on the homepage.
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
                    {form.formState.isSubmitting ? 'Creating...' : 'Create Banner'}
                </Button>
                </DialogFooter>
            </form>
            </Form>
      </DialogContent>
    </Dialog>
  );
}
