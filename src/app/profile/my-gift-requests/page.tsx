'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { PersonalizationRequest } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function UserGiftRequestsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login?redirect=/profile/my-gift-requests');
    }
  }, [user, isUserLoading, router]);

  const requestsQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, 'personalizationRequests'), where('userId', '==', user.uid)) : null),
    [firestore, user]
  );

  const { data: requests, isLoading } = useCollection<PersonalizationRequest>(requestsQuery);
  
  const sortedRequests = useMemo(() => {
    if (!requests) return [];
    return [...requests].sort((a, b) => {
      const dateA = a.createdAt?.toDate()?.getTime() || 0;
      const dateB = b.createdAt?.toDate()?.getTime() || 0;
      return dateB - dateA;
    });
  }, [requests]);


  const getStatusVariant = (status: PersonalizationRequest['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in-progress': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };
  
    if (isUserLoading || !user) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <TooltipProvider>
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
            <Link href="/profile"><ArrowLeft /></Link>
        </Button>
        <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">My Gift Requests</h1>
            <p className="text-muted-foreground">Track your personalization requests.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>A list of all your submitted personalization requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Custom Text</TableHead>
                  <TableHead>Reason for Cancellation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    </TableRow>
                  ))}
                {sortedRequests &&
                  sortedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="whitespace-nowrap">{request.createdAt ? format(request.createdAt.toDate(), 'MMM d, yyyy') : 'N/A'}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{request.productId}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="truncate max-w-xs">
                          <Tooltip>
                              <TooltipTrigger>
                                  <p className="truncate max-w-[150px] sm:max-w-xs">{request.customText || "N/A"}</p>
                              </TooltipTrigger>
                              <TooltipContent>
                                  <p>{request.customText}</p>
                              </TooltipContent>
                          </Tooltip>
                      </TableCell>
                      <TableCell>
                          {request.cancellationReason ? (
                              <Tooltip>
                                  <TooltipTrigger>
                                      <p className="truncate max-w-[150px] sm:max-w-xs text-destructive">{request.cancellationReason}</p>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-destructive text-destructive-foreground max-w-sm">
                                      <p>{request.cancellationReason}</p>
                                  </TooltipContent>
                              </Tooltip>
                          ) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {!isLoading && (!sortedRequests || sortedRequests.length === 0) && (
            <div className="flex flex-col items-center justify-center text-center py-16">
                <Gift className="h-12 w-12 text-muted-foreground mb-4"/>
              <p className="text-lg font-medium text-muted-foreground">You haven't made any gift requests yet.</p>
              <Button asChild className="mt-4">
                  <Link href="/personalized-gifts">Make a Request</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
}
