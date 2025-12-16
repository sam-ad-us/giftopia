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
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PersonalizationRequest } from '@/lib/types';

const cancelSchema = z.object({
  reason: z.string().min(10, 'Please provide a reason for cancellation (at least 10 characters).'),
});

interface CancelRequestDialogProps {
  request: PersonalizationRequest | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelRequestDialog({ request, isOpen, onOpenChange }: CancelRequestDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof cancelSchema>>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof cancelSchema>) => {
    if (!firestore || !request) return;
    try {
      const requestRef = doc(firestore, 'personalizationRequests', request.id);
      await updateDoc(requestRef, {
        status: 'cancelled',
        cancellationReason: values.reason,
      });

      toast({
        title: 'Request Cancelled',
        description: `The request has been successfully cancelled.`,
        variant: 'destructive',
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel request. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Request</DialogTitle>
          <DialogDescription>
            Provide a reason for cancelling this personalization request. The customer will be notified.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Cancellation</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., The requested customization is not possible for this product." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Back
              </Button>
              <Button type="submit" variant="destructive" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
