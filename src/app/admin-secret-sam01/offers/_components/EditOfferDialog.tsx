
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Offer } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const offerSchema = z.object({
  name: z.string().min(3, 'Offer name must be at least 3 characters.'),
  type: z.enum(['percentage', 'flat'], { required_error: 'Please select an offer type.' }),
  value: z.coerce.number().positive('Discount value must be a positive number.'),
  status: z.enum(['active', 'inactive']),
});

interface EditOfferDialogProps {
  offer: Offer;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOfferDialog({ offer, isOpen, onOpenChange }: EditOfferDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof offerSchema>>({
    resolver: zodResolver(offerSchema),
    defaultValues: offer,
  });

  useEffect(() => {
    if (offer) {
      form.reset(offer);
    }
  }, [offer, form]);

  const onSubmit = async (values: z.infer<typeof offerSchema>) => {
    if (!firestore || !offer.id) return;
    try {
      const offerRef = doc(firestore, 'offers', offer.id);
      await updateDoc(offerRef, values);
      toast({
        title: 'Offer Updated',
        description: `The "${values.name}" offer has been successfully updated.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to update offer. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Offer</DialogTitle>
          <DialogDescription>Update the details for this special offer.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Sale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={form.watch('type') === 'percentage' ? '15' : '100'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Status</FormLabel>
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
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
