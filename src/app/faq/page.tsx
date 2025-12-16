'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const faqItems = [
    {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website. You can also find your tracking information in the 'My Orders' section of your profile."
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 15 days of delivery for most items. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging. Personalized items are generally not eligible for returns unless there is a manufacturing defect."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and Cash on Delivery (COD). All online transactions are secure and encrypted."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping usually takes 3-5 business days. Express shipping options are available at checkout for faster delivery. Please note that delivery times may vary based on your location and public holidays."
    },
    {
        question: "Can I cancel my order?",
        answer: "You can cancel your order within 2 hours of placing it. After this period, the order may have already been processed and prepared for shipping. Please visit the 'My Orders' page to see if cancellation is still possible."
    },
    {
        question: "How do I request a personalized gift?",
        answer: "You can submit a request through our 'Personalized Gifts' page. Simply select the product you're interested in, provide your customization details, and our team will get in touch with you to finalize the design and pricing."
    }
];


export default function FaqPage() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-12">
            <div className="text-center mb-8">
                <HelpCircle className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Frequently Asked Questions</h1>
                <p className="text-muted-foreground mt-2">
                    Find answers to common questions about our products, services, and policies.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Top Questions</CardTitle>
                    <CardDescription>
                        Can't find the answer you're looking for? Feel free to contact our support team.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                       {faqItems.map((item, index) => (
                         <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                            <AccordionContent className="prose prose-sm text-muted-foreground">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                       ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
