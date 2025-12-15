'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function AdminTaxPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Tax</h1>
                <p className="text-muted-foreground">Manage your tax settings and rates.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Tax Management</CardTitle>
                    <CardDescription>A placeholder for adding, editing, and managing tax configurations.</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">Tax management interface will be here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
