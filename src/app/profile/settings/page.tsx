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
import { ArrowLeft } from 'lucide-react';

export default function UserSettingsPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/profile"><ArrowLeft /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your profile and account preferences.</p>
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>This is a placeholder for your account settings.</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">User settings and profile management interface will be here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
