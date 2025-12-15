'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Offer } from '@/lib/types';
import { deleteDoc, doc } from 'firebase/firestore';

interface DeleteOfferAlertProps {
  offer: Offer;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteOfferAlert({ offer, isOpen, onOpenChange }: DeleteOfferAlertProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!firestore || !offer.id) return;
    try {
      const offerRef = doc(firestore, 'offers', offer.id);
      await deleteDoc(offerRef);
      toast({
        title: 'Offer Deleted',
        description: `The offer "${offer.name}" has been permanently deleted.`,
        variant: 'destructive',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete offer. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this offer?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the offer "{offer.name}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
