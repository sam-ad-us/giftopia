
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, type UserCredential, type FirebaseAuthError, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Shield, Gift, Loader2 } from 'lucide-react';

const ADMIN_UID = 'hxXvnUjr13WjNPbuv9NbMNWOSGF2';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
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
    if (result.user.uid === ADMIN_UID) {
      router.push('/admin-secret-sam01');
    } else {
      // Immediately sign out non-admin users
      if (auth) {
        signOut(auth);
      }
      toast({
        title: "Access Denied",
        description: "You are not authorized to access the admin panel.",
        variant: "destructive",
      });
    }
  };

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    if (!auth) return;
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
    if (!isUserLoading && user) {
        if (user.uid === ADMIN_UID) {
            router.replace('/admin-secret-sam01');
        }
    }
  }, [user, isUserLoading, router]);


  if (isUserLoading || user?.uid === ADMIN_UID) {
      return (
        <div className="flex h-screen items-center justify-center bg-sidebar-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar-background px-4">
        <div className="w-full max-w-sm">
            <div className="mx-auto flex justify-center items-center gap-2 mb-6">
                <Gift className="h-8 w-8 text-sidebar-primary" />
                <span className="text-2xl font-bold text-sidebar-primary">Giftopia Admin</span>
            </div>
            <Card className="bg-background text-foreground">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem className="grid gap-2 text-left">
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
                        <FormItem className="grid gap-2 text-left">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing In...' : 'Sign in'}
                    </Button>
                    </CardFooter>
                </form>
                </Form>
            </Card>
         </div>
    </div>
  );
}
