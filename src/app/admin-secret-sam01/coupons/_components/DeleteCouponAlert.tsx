
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
import { Coupon } from '@/lib/types';
import { deleteDoc, doc } from 'firebase/firestore';

interface DeleteCouponAlertProps {
  coupon: Coupon;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCouponAlert({ coupon, isOpen, onOpenChange }: DeleteCouponAlertProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!firestore || !coupon.id) return;
    try {
      const couponRef = doc(firestore, 'coupons', coupon.id);
      await deleteDoc(couponRef);
      toast({
        title: 'Coupon Deleted',
        description: `The coupon "${coupon.code}" has been permanently deleted.`,
        variant: 'destructive',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete coupon. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this coupon?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the coupon "{coupon.code}".
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
