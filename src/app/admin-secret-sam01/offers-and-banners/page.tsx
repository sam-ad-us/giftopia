
'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function AdminOffersAndBannersPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Offers and Banners</h1>
                    <p className="text-muted-foreground">Manage your promotional offers and banners.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Banner
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Banner Management</CardTitle>
                    <CardDescription>A placeholder for adding, editing, and managing banners.</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">Banner management interface will be here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
