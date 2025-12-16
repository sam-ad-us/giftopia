
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="text-center mb-8">
                <Shield className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Privacy Policy</h1>
                <p className="text-muted-foreground mt-2">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Our Commitment to Your Privacy</CardTitle>
                    <CardDescription>
                        Your privacy is important to us. It is Giftopia's policy to respect your privacy regarding any information we may collect from you across our website.
                    </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                    <h2>1. Information We Collect</h2>
                    <p>
                        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
                    </p>
                    <p>
                        Information we collect includes:
                        <ul>
                            <li><strong>Personal Identification Information:</strong> Name, email address, shipping address, phone number when you create an account or place an order.</li>
                            <li><strong>Payment Information:</strong> We do not store your credit card details. All payment processing is handled by our secure third-party payment gateways.</li>
                            <li><strong>Order Information:</strong> Details about the products you purchase and your order history.</li>
                        </ul>
                    </p>
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect in various ways, including to:</p>
                    <ul>
                        <li>Provide, operate, and maintain our website</li>
                        <li>Process your transactions and manage your orders</li>
                        <li>Improve, personalize, and expand our website</li>
                        <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                        <li>Send you emails</li>
                        <li>Find and prevent fraud</li>
                    </ul>

                    <h2>3. Security of Your Information</h2>
                    <p>
                        We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                    </p>
                    
                    <h2>4. Your Rights</h2>
                    <p>
                        You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services. You have the right to access, update, or delete your personal information at any time by accessing your account settings.
                    </p>
                    
                    <h2>5. Changes to This Privacy Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.
                    </p>
                    
                    <h2>6. Contact Us</h2>
                    <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to <a href="/support">contact us</a>.</p>
                </CardContent>
            </Card>
        </div>
    );
}
