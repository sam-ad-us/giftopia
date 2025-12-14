'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Ticket, Percent, ShoppingBag } from 'lucide-react';

const stats = [
    { title: 'Total Products', value: '1,254', icon: Package, change: '+12.5%' },
    { title: 'Active Offers', value: '23', icon: Percent, change: '+5' },
    { title: 'Coupons Used', value: '345', icon: Ticket, change: '-2.1%' },
    { title: 'Total Orders', value: '8,432', icon: ShoppingBag, change: '+20.1%' },
]

export default function AdminDashboardPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">An overview of your gift shop's performance.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
             {/* Placeholder for future charts/widgets */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Sales Over Time</CardTitle>
                         <CardDescription>A placeholder for a sales chart.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex h-[300px] items-center justify-center">
                        <p className="text-muted-foreground">Chart will be displayed here.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>A placeholder for recent orders.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex h-[300px] items-center justify-center">
                        <p className="text-muted-foreground">Recent orders will be listed here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
