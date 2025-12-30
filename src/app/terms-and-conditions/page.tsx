
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsAndConditionsPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="text-center mb-8">
                <FileText className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Terms and Conditions</h1>
                <p className="text-muted-foreground mt-2">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Agreement to our Legal Terms</CardTitle>
                    <CardDescription>
                        Welcome to Giftopia! These Terms and Conditions govern your use of our website and services.
                    </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                    <h2>1. Introduction</h2>
                    <p>
                        By accessing our website, you agree to be bound by these Terms and Conditions and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                    
                    <h2>2. User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                    </p>

                    <h2>3. Products and Services</h2>
                    <p>
                        We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products. All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
                    </p>
                    
                    <h2>4. Purchases and Payment</h2>
                    <p>
                        We accept various forms of payment, as listed during the checkout process. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.
                    </p>

                    <h2>5. Intellectual Property</h2>
                    <p>
                        The Site and its original content, features and functionality are and will remain the exclusive property of Giftopia and its licensors. The Service is protected by copyright, trademark, and other laws of both the India and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Giftopia.
                    </p>
                    
                    <h2>6. Limitation of Liability</h2>
                    <p>
                        In no event shall Giftopia, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>

                    <h2>7. Governing Law</h2>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                    </p>
                    
                    <h2>8. Changes to These Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                    
                    <h2>9. Contact Us</h2>
                    <p>If you have any questions about these Terms, please <a href="/support">contact us</a>.</p>
                </CardContent>
            </Card>
        </div>
    );
}
