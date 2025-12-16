
'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { EditHomepageBannerDialog } from './_components/EditHomepageBannerDialog';

export default function AdminOffersAndBannersPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Offers and Banners</h1>
                    <p className="text-muted-foreground">Manage your promotional offers and banners.</p>
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Homepage Banner</CardTitle>
                    <CardDescription>Manage the main promotional banner on your homepage.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <p className="text-muted-foreground">Update the content of the special offer section.</p>
                    <EditHomepageBannerDialog>
                        <Button>
                            <Edit className="mr-2 h-5 w-5" />
                            Edit Homepage Banner
                        </Button>
                    </EditHomepageBannerDialog>
                </CardContent>
            </Card>
        </div>
    );
}
