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

export default function AdminOffersPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
                    <p className="text-muted-foreground">Create and manage special offers.</p>
                </div>
                 <Button>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Offer
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Offer Management</CardTitle>
                    <CardDescription>A placeholder for creating and assigning offers.</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">Offer management interface will be here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
