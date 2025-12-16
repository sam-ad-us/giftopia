
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, query, serverTimestamp } from 'firebase/firestore';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const personalizationSchema = z.object({
  productId: z.string({ required_error: 'Please select a product to personalize.' }),
  customText: z.string().optional(),
  additionalInstructions: z.string().optional(),
  // For simplicity, we are not handling actual file uploads here.
  // In a real app, you would handle the file object and upload it to Firebase Storage.
  customImage: z.any().optional(),
});

export default function PersonalizedGiftsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const productsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products')) : null),
    [firestore]
  );
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const form = useForm<z.infer<typeof personalizationSchema>>({
    resolver: zodResolver(personalizationSchema),
    defaultValues: {
      customText: '',
      additionalInstructions: '',
    },
  });
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/personalized-gifts');
    }
  }, [user, isUserLoading, router]);

  const onSubmit = async (values: z.infer<typeof personalizationSchema>) => {
    if (!user || !firestore) return;
    
    // In a real app, you'd upload the image here and get a URL.
    // For now, we'll just simulate this.
    const customImageUrl = values.customImage ? 'https://example.com/image.jpg' : null;

    try {
      await addDoc(collection(firestore, 'personalizationRequests'), {
        userId: user.uid,
        productId: values.productId,
        customText: values.customText || null,
        customImageUrl: customImageUrl,
        additionalInstructions: values.additionalInstructions || null,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Request Submitted!',
        description: "We've received your personalization request and will get back to you soon.",
      });
      form.reset();
    } catch (error) {
        console.error("Error submitting request:", error);
        toast({
            title: 'Error',
            description: 'Failed to submit your request. Please try again.',
            variant: 'destructive',
        });
    }
  };

  if (isUserLoading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Create Your Personalized Gift</h1>
        <p className="text-muted-foreground mt-2">
          Bring your unique vision to life. Fill out the form below to get started.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personalization Details</CardTitle>
          <CardDescription>
            Select a product and provide your customization details. Note that pricing may vary based on complexity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product to Personalize</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingProducts}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingProducts ? "Loading products..." : "Select a product"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products?.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engraving or Text (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Happy Anniversary, Sarah!'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload an Image (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="file" className="opacity-0 absolute inset-0 z-10" {...field} />
                        <Button variant="outline" type="button" className="w-full justify-start gap-2">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span>Choose file...</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>Upload a photo or design for printing.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requests? e.g., 'Use a script font for the text.'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
