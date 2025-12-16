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
import { Category } from '@/lib/types';
import { deleteDoc, doc } from 'firebase/firestore';

interface DeleteCategoryAlertProps {
  category: Category;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryAlert({ category, isOpen, onOpenChange }: DeleteCategoryAlertProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!firestore || !category.id) return;
    try {
      const categoryRef = doc(firestore, 'categories', category.id);
      await deleteDoc(categoryRef);
      toast({
        title: 'Category Deleted',
        description: `The category "${category.name}" has been permanently deleted.`,
        variant: 'destructive',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the category "{category.name}".
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