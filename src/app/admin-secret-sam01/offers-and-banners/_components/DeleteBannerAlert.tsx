
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
import { HomepageBanner } from '@/lib/types';
import { deleteDoc, doc } from 'firebase/firestore';

interface DeleteBannerAlertProps {
  banner: HomepageBanner;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBannerAlert({ banner, isOpen, onOpenChange }: DeleteBannerAlertProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!firestore || !banner.id) return;
    try {
      const bannerRef = doc(firestore, 'homepageBanner', banner.id);
      await deleteDoc(bannerRef);
      toast({
        title: 'Banner Deleted',
        description: `The banner "${banner.title}" has been permanently deleted.`,
        variant: 'destructive',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete banner. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this banner?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the banner "{banner.title}".
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
