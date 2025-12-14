'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield } from 'lucide-react';

const ADMIN_EMAIL = 'admin-sam@giftopia.com';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If auth state is still loading, do nothing yet.
    if (isUserLoading) {
      return;
    }

    // If loading is finished and there's no user, redirect to login.
    if (!user) {
      router.replace('/login');
      return;
    }

    // If a user is logged in, check if they are the admin.
    if (user.email !== ADMIN_EMAIL) {
      // If not the admin, redirect to the homepage.
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  // While loading or if redirection is in progress, show a loading state.
  if (isUserLoading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Card className="w-full max-w-md">
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  // If the user is the admin, show the admin content.
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Shield className="h-10 w-10 text-primary" />
        <div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Welcome, {user.displayName || user.email}.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Secret Admin Page</CardTitle>
          <CardDescription>This area is restricted to authorized administrators only.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You have successfully accessed the admin dashboard. Here you can manage products, view orders, and oversee website operations.</p>
        </CardContent>
      </Card>
    </div>
  );
}
