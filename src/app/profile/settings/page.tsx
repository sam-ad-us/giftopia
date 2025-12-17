'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, KeyRound, User as UserIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useUser } from '@/firebase';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePassword, type User, type FirebaseAuthError, linkWithCredential, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const profileSchema = z.object({
    displayName: z.string().min(2, 'Name must be at least 2 characters.'),
});

function ProfileSettings() {
    const { user } = useUser();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user?.displayName || '',
        },
    });

    const handleProfileUpdate = async (values: z.infer<typeof profileSchema>) => {
        if (!user) return;
        try {
            await updateProfile(user as User, { displayName: values.displayName });
            toast({
                title: "Profile Updated",
                description: "Your display name has been successfully updated.",
            });
        } catch (error) {
            console.error("Error updating profile", error);
            toast({
                title: "Error Updating Profile",
                description: "Failed to update your profile. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-4 max-w-sm">
                    <FormField control={form.control} name="displayName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </Form>
        </CardContent>
    )
}

function SecuritySettings() {
    const { user } = useUser();
    const { toast } = useToast();
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { newPassword: '', confirmPassword: '' },
    });

    const handlePasswordUpdate = async (values: z.infer<typeof passwordSchema>) => {
        if (!user) return;
        
        try {
            // For users who signed up via Google and want to add a password
            if (user.providerData.some(p => p.providerId === 'google.com') && !user.providerData.some(p => p.providerId === 'password')) {
                const credential = EmailAuthProvider.credential(user.email!, values.newPassword);
                await linkWithCredential(user as User, credential);
                toast({ title: "Password Set", description: "You can now log in with your email and password." });
            } else {
                // For users who already have a password
                await updatePassword(user as User, values.newPassword);
                toast({ title: "Password Updated", description: "Your password has been changed successfully." });
            }
            setShowPasswordFields(false);
            form.reset();
        } catch (error) {
            const fbError = error as FirebaseAuthError;
            let errorMessage = "Failed to update password. Please try again.";
            if (fbError.code === 'auth/requires-recent-login') {
                errorMessage = "This is a sensitive action. Please sign out and log back in to change your password.";
            } else if (fbError.code === 'auth/credential-already-in-use') {
                 errorMessage = "This account is already linked with another user.";
            }
            console.error("Error updating password", error);
            toast({ title: "Error Updating Password", description: errorMessage, variant: "destructive" });
        }
    }
    
    const isPasswordProvider = user?.providerData.some(p => p.providerId === 'password');

    return (
         <CardContent>
            <div>
                {!showPasswordFields ? (
                    <Button onClick={() => setShowPasswordFields(true)}>
                        <KeyRound className="mr-2 h-4 w-4"/>
                        {isPasswordProvider ? 'Change Password' : 'Set Password'}
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
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {isPasswordProvider ? 'Update Password' : 'Set Password'}
                                </Button>
                                <Button variant="ghost" type="button" onClick={() => { setShowPasswordFields(false); form.reset(); }}>Cancel</Button>
                            </div>
                        </form>
                    </Form>
                )}
            </div>
        </CardContent>
    )
}

export default function UserSettingsPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/profile"><ArrowLeft /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your profile and account preferences.</p>
                </div>
            </div>
             <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                            <CardDescription>Update your display name.</CardDescription>
                        </CardHeader>
                        <ProfileSettings />
                    </Card>
                </TabsContent>
                <TabsContent value="security">
                     <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your password and account security.</CardDescription>
                        </CardHeader>
                        <SecuritySettings />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
