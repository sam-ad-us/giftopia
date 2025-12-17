'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, useUser } from '@/firebase';
import { sendPasswordResetEmail, type FirebaseAuthError } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });

  const handlePasswordReset = async (values: z.infer<typeof resetSchema>) => {
    if (!auth) return;
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox for instructions to reset your password.",
      });
      router.push('/login');
    } catch (error) {
      const fbError = error as FirebaseAuthError;
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (fbError.code === 'auth/user-not-found') {
          errorMessage = "No account found with this email address."
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/profile');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] bg-secondary px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePasswordReset)}>
            <CardContent>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button variant="link" asChild>
                <Link href="/login">Back to Sign In</Link>
            </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
