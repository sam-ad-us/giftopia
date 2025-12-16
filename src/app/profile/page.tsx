
'use client';

import { useUser, useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Settings, ShoppingBag, ShieldCheck, Mail, Calendar, KeyRound } from 'lucide-react';
import { signOut, sendPasswordResetEmail, updatePassword, type User, type FirebaseAuthError } from 'firebase/auth';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };
  
  const handlePasswordReset = async () => {
    if (!user?.email || !auth) {
       toast({ title: "Error", description: "No email address found for your account.", variant: "destructive" });
       return;
    };
    try {
        await sendPasswordResetEmail(auth, user.email);
        toast({ title: "Password Reset Email Sent", description: "Check your inbox for instructions to reset your password." });
    } catch (error) {
        console.error("Error sending password reset email", error);
        toast({ title: "Error", description: "Could not send password reset email. Please try again later.", variant: "destructive" });
    }
  }

  const handlePasswordUpdate = async (values: z.infer<typeof passwordSchema>) => {
    if (!user) return;
    try {
        await updatePassword(user as User, values.newPassword);
        toast({ title: "Password Updated", description: "Your password has been changed successfully." });
        setShowPasswordFields(false);
        form.reset();
    } catch (error) {
        const fbError = error as FirebaseAuthError;
        let errorMessage = "Failed to update password. Please try again.";
        if (fbError.code === 'auth/requires-recent-login') {
            errorMessage = "This action requires you to have signed in recently. Please sign out and log back in to change your password.";
        }
        console.error("Error updating password", error);
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name[0];
  };

  const isPasswordProvider = user?.providerData.some(p => p.providerId === 'password');
  
  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
             <Card>
                <CardHeader className="flex flex-col items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-8 w-40 mt-4" />
                    <Skeleton className="h-4 w-48 mt-2" />
                </CardHeader>
             </Card>
          </div>
           <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-[calc(100vh-14rem)] py-12">
        <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
            <Card className="text-center">
                <CardHeader>
                <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback className="text-3xl">
                    {getInitials(user.displayName)}
                    </AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline text-2xl">{user.displayName}</CardTitle>
                <CardDescription>Gold Member</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSignOut} variant="outline" className="w-full">
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
            </div>
            <div className="md:col-span-3">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline">Account Details</CardTitle>
                <CardDescription>
                    Review and manage your account information.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                        </div>
                    </div>
                    <Separator />
                     <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                    <Separator />
                     <div className="flex items-center gap-4">
                        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                        <div>
                        <p className="text-sm text-muted-foreground">Account Status</p>
                        <p className="font-medium text-green-600">Verified</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline">Security</CardTitle>
                    <CardDescription>Manage your password and account security.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isPasswordProvider ? (
                        <div>
                            {!showPasswordFields ? (
                                <Button onClick={() => setShowPasswordFields(true)}>
                                    <KeyRound className="mr-2 h-4 w-4"/>
                                    Change Password
                                </Button>
                            ) : (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="space-y-4 max-w-sm">
                                        <FormField control={form.control} name="newPassword" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl><Input type="password" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl><Input type="password" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={form.formState.isSubmitting}>Update Password</Button>
                                            <Button variant="ghost" onClick={() => { setShowPasswordFields(false); form.reset(); }}>Cancel</Button>
                                        </div>
                                    </form>
                                </Form>
                            )}
                        </div>
                    ) : (
                         <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                            <p className="text-sm text-muted-foreground">You are signed in with Google. To set a password, please use the password reset option.</p>
                            <Button onClick={handlePasswordReset}>Reset Password</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

             <Card className="mt-8">
                <CardHeader>
                <CardTitle className="font-headline">My Activity</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start gap-2 h-12 text-base" asChild>
                        <Link href="/profile/your-order">
                            <ShoppingBag className="h-5 w-5"/>
                            Order History
                        </Link>
                    </Button>
                     <Button variant="outline" className="justify-start gap-2 h-12 text-base" asChild>
                        <Link href="/profile/settings">
                            <Settings className="h-5 w-5"/>
                            Account Settings
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            </div>
        </div>
        </div>
    </div>
  );
}
