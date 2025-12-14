'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, type UserCredential, type FirebaseAuthError } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const ADMIN_EMAIL = 'admin-sam@giftopia.com';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export default function AdminLoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSuccessfulLogin = (result: UserCredential) => {
    if (result.user.email === ADMIN_EMAIL) {
      router.push('/admin-secret-sam01');
    } else {
      router.push('/');
      toast({
        title: "Access Denied",
        description: "You are not authorized to access the admin panel.",
        variant: "destructive",
      });
    }
  };

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true);
    try {
      const result = await signInWithEmailAndPassword(auth, values.email, values.password);
      handleSuccessfulLogin(result);
    } catch (error) {
      const fbError = error as FirebaseAuthError;
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (fbError.code === 'auth/user-not-found' || fbError.code === 'auth/wrong-password' || fbError.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error signing in with email', fbError.code);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!isUserLoading && user && user.email === ADMIN_EMAIL) {
        router.push('/admin-secret-sam01');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || (user && user.email === ADMIN_EMAIL)) {
      return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] bg-primary-deeper/10 px-4 py-12">
      <Card className="w-full max-w-sm border-primary/50 shadow-lg">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                <Shield className="h-8 w-8 text-primary"/>
            </div>
          <CardTitle className="font-headline text-2xl mt-2">Admin Login</CardTitle>
          <CardDescription>Restricted Access</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Sign in as Admin'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
