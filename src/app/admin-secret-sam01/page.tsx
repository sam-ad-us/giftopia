
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Percent, ShoppingBag, IndianRupee, Warehouse } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Product, Offer, Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useMemo } from 'react';
import { subDays, format, startOfDay } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, isLoading, change, changeType }: { title: string, value: string | number, icon: React.ElementType, isLoading: boolean, change?: string, changeType?: 'increase' | 'decrease' }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-20 mt-1" />
                        <Skeleton className="h-4 w-28 mt-2" />
                    </>
                ) : (
                    <>
                        <div className="text-2xl font-bold">{value}</div>
                        {change && <p className="text-xs text-muted-foreground">{change} from last month</p>}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;


export default function AdminDashboardPage() {
    const firestore = useFirestore();

    const productsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'products')) : null, [firestore]);
    const offersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'offers'), where('status', '==', 'active')) : null, [firestore]);
    const ordersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'orders')) : null, [firestore]);
    const recentOrdersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'), limit(5)) : null, [firestore]);

    const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);
    const { data: activeOffers, isLoading: isLoadingOffers } = useCollection<Offer>(offersQuery);
    const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(ordersQuery);
    const { data: recentOrders, isLoading: isLoadingRecentOrders } = useCollection<Order>(recentOrdersQuery);
    
    const totalRevenue = useMemo(() => {
        if (!orders) return 0;
        return orders.reduce((acc, order) => acc + order.total, 0);
    }, [orders]);

    const totalUnitsInStock = useMemo(() => {
        if (!products) return 0;
        return products.reduce((acc, product) => acc + (product.quantity || 0), 0);
    }, [products]);

    const salesData = useMemo(() => {
        if (!orders) return [];
        
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = startOfDay(subDays(new Date(), i));
            return { date: format(date, 'MMM d'), revenue: 0 };
        }).reverse();

        orders.forEach(order => {
            if (order.createdAt) {
                const orderDate = startOfDay(order.createdAt.toDate());
                const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
                if (orderDate >= sevenDaysAgo) {
                    const formattedDate = format(orderDate, 'MMM d');
                    const dayData = last7Days.find(d => d.date === formattedDate);
                    if (dayData) {
                        dayData.revenue += order.total;
                    }
                }
            }
        });
        return last7Days;
    }, [orders]);


    const getStatusVariant = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'secondary';
            case 'shipped': return 'default';
            case 'delivered': return 'outline';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };


    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">An overview of your gift shop's performance.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={IndianRupee} isLoading={isLoadingOrders} change="+20.1%"/>
                <StatCard title="Unique Products" value={products?.length ?? 0} icon={Package} isLoading={isLoadingProducts} change="+12.5%"/>
                <StatCard title="Total Units in Stock" value={totalUnitsInStock} icon={Warehouse} isLoading={isLoadingProducts} />
                <StatCard title="Active Offers" value={activeOffers?.length ?? 0} icon={Percent} isLoading={isLoadingOffers} change="+5" />
                <StatCard title="Total Orders" value={orders?.length ?? 0} icon={ShoppingBag} isLoading={isLoadingOrders} change="+180.1%" />
            </div>
             
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Sales Over Time</CardTitle>
                         <CardDescription>Showing total revenue for the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full pl-2">
                       {isLoadingOrders ? (
                           <div className="flex h-full items-center justify-center p-6">
                            <Skeleton className="h-full w-full" />
                           </div>
                       ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value / 1000}k`} />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                    <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Revenue
                                                        </span>
                                                        <span className="font-bold text-muted-foreground">
                                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value as number)}
                                                        </span>
                                                    </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null;
                                    }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                       )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>The last 5 orders from your store.</CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/admin-secret-sam01/orders">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="h-[300px] p-0">
                         {isLoadingRecentOrders ? (
                             <div className="p-6 space-y-4">
                                {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                             </div>
                         ) : (
                             <Table>
                                 <TableHeader>
                                     <TableRow>
                                         <TableHead>Customer</TableHead>
                                         <TableHead className="text-right">Total</TableHead>
                                     </TableRow>
                                 </TableHeader>
                                 <TableBody>
                                     {recentOrders && recentOrders.map(order => (
                                         <TableRow key={order.id}>
                                             <TableCell>
                                                 <div className="font-medium">{order.customerName}</div>
                                                 <div className="text-sm text-muted-foreground">{order.shippingAddress.city}</div>
                                             </TableCell>
                                             <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                                         </TableRow>
                                     ))}
                                 </TableBody>
                             </Table>
                         )}
                         {!isLoadingRecentOrders && (!recentOrders || recentOrders.length === 0) && (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-muted-foreground">No recent orders.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    

    
