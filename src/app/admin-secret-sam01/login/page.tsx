'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, type UserCredential, type FirebaseAuthError } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const ADMIN_EMAIL = 'admin-sam@giftopia.com';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}>
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.998C34.695 6.225 29.624 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691c-2.313 4.518-2.313 9.891 0 14.409l-4.881 3.791A19.998 19.998 0 0 1 4 24c0-3.518.891-6.852 2.46-9.694l4.846 3.385z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-4.79-3.791c-2.825 1.7-6.324 2.6-10.019 2.6c-4.404 0-8.28-2.062-10.75-5.332l-4.881 3.791A19.998 19.998 0 0 1 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083L43.594 20H24v8h11.303a12.03 12.03 0 0 1-5.495 5.332l4.79 3.791A19.96 19.96 0 0 0 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      handleSuccessfulLogin(result);
    } catch (error) {
      const fbError = error as FirebaseAuthError;
      if (fbError.code !== 'auth/cancelled-popup-request' && fbError.code !== 'auth/popup-closed-by-user') {
        console.error('Error signing in with Google', error);
        toast({
          title: "Sign-in Failed",
          description: "Could not sign in with Google. Please try again.",
          variant: "destructive",
        });
      }
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
               <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
