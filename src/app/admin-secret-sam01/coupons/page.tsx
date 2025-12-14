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

export default function AdminCouponsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">Manage your discount coupons.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Coupon
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Coupon Management</CardTitle>
                    <CardDescription>A placeholder for creating and managing coupon codes.</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">Coupon management interface will be here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
