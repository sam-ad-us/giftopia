'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LifeBuoy, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const supportSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(5, 'Please enter a subject.'),
  message: z.string().min(10, 'Please enter a message.'),
});

export default function SupportPage() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof supportSchema>>({
        resolver: zodResolver(supportSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });
    
    // This is a placeholder submit handler.
    // In a real app, you would send this data to a backend service.
    const onSubmit = (values: z.infer<typeof supportSchema>) => {
        console.log('Support form submitted:', values);
        toast({
            title: 'Message Sent!',
            description: "We've received your message and will get back to you shortly.",
        });
        form.reset();
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <div className="text-center mb-8">
                <LifeBuoy className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Support Center</h1>
                <p className="text-muted-foreground mt-2">
                    Have questions or need help with an order? We're here for you.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>
                        Fill out the form below and our team will get back to you as soon as possible.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Your Email</FormLabel><FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                             <FormField control={form.control} name="subject" render={({ field }) => (
                                <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Question about my order" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="message" render={({ field }) => (
                                <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Please describe your issue in detail..." rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                                <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}