'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function AdminOrdersPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">View and manage customer orders.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>A placeholder for listing and managing orders.</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">Order management interface will be here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
