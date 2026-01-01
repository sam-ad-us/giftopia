'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  type UserCredential,
  type FirebaseAuthError,
} from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

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

const ADMIN_EMAIL = 'admin-sam@giftopia.com';

export default function LoginClient() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSuccessfulLogin = (result: UserCredential) => {
    if (result.user.email === ADMIN_EMAIL) {
      router.push('/admin-secret-sam01');
    } else {
      router.push(redirectUrl);
    }
  };

  const handleEmailLogin = async (values: z.infer<typeof loginSchema>) => {
    if (!auth) return;
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
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      handleSuccessfulLogin(result);
    } catch (error) {
      const fbError = error as FirebaseAuthError;
      if (fbError.code !== 'auth/cancelled-popup-request' && fbError.code !== 'auth/popup-closed-by-user') {
        console.error('Error signing in with Google', error);
        toast({
          title: 'Sign-in Failed',
          description: 'Could not sign in with Google. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  useEffect(() => {
    if (!isUserLoading && user) {
        if (user.email === ADMIN_EMAIL) {
            router.push('/admin-secret-sam01');
        } else {
            router.push(redirectUrl);
        }
    }
  }, [user, isUserLoading, router, redirectUrl]);

  if (isUserLoading || user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] bg-secondary px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailLogin)}>
            <CardContent className="grid gap-4">
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-baseline">
                        <FormLabel>Password</FormLabel>
                        <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
                          <Link href="/forgot-password">Forgot password?</Link>
                        </Button>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </CardContent>
          </form>
        </Form>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full flex justify-center items-center">
            <Separator className="w-full" />
            <span className="absolute bg-background px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            type="button"
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
