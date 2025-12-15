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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the type for a Personalization Request
interface PersonalizationRequest {
    id: string;
    userId: string;
    productId: string;
    customText?: string;
    customImageUrl?: string;
    additionalInstructions?: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: any; // Firestore ServerTimestamp
}

export default function AdminGiftRequestsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const requestsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'personalizationRequests'), orderBy('createdAt', 'desc')) : null),
    [firestore]
  );

  const { data: requests, isLoading } = useCollection<PersonalizationRequest>(requestsQuery);
  
  const getStatusVariant = (status: PersonalizationRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in-progress':
        return 'default';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleUpdateStatus = async (request: PersonalizationRequest, status: PersonalizationRequest['status']) => {
    if (!firestore) return;
    const requestRef = doc(firestore, 'personalizationRequests', request.id);
    try {
      await updateDoc(requestRef, { status });
      toast({
        title: 'Request Status Updated',
        description: `Request ${request.id.substring(0,6)}... is now ${status}.`,
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update request status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Personalization Requests</h1>
        <p className="text-muted-foreground">View and manage custom gift requests.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>A list of all personalization requests from customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Custom Text</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
              {requests &&
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.createdAt ? format(request.createdAt.toDate(), 'PP') : 'N/A'}</TableCell>
                    <TableCell className="font-mono text-xs">{request.productId}</TableCell>
                    <TableCell className="truncate max-w-xs">{request.customText || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(request, 'in-progress')}>
                            <Clock className="mr-2 h-4 w-4" />
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(request, 'completed')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {!isLoading && (!requests || requests.length === 0) && (
            <div className="flex h-[150px] items-center justify-center text-center">
              <p className="text-muted-foreground">No personalization requests have been submitted yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
