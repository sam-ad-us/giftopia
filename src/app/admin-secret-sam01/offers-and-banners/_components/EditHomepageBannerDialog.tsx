
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
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
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
    banner: HomepageBanner;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditHomepageBannerDialog({ banner, isOpen, onOpenChange }: EditHomepageBannerDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bannerSchema>>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
        ...banner,
        badgeText: banner.badgeText || '',
    }
  });

  useEffect(() => {
    if (banner) {
      form.reset({
        ...banner,
        badgeText: banner.badgeText || '', // Ensure optional fields are not null/undefined
      });
    }
  }, [banner, form]);

  const onSubmit = async (values: z.infer<typeof bannerSchema>) => {
    if (!firestore || !banner.id) return;
    try {
      const bannerRef = doc(firestore, 'homepageBanner', banner.id);
      await updateDoc(bannerRef, {
          ...values,
          badgeText: values.badgeText || null
      });
      toast({
        title: 'Banner Updated',
        description: `The homepage banner has been successfully updated.`,
      });
      onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Homepage Banner</DialogTitle>
          <DialogDescription>Update the content of the promotional banner.</DialogDescription>
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
      </DialogContent>
    </Dialog>
  );
}
