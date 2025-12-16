import Link from 'next/link';
import { Gift, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary">Gift Shop Info</Link></li>
            </ul>
          </div>

          {/* Customer Help Section */}
          <div>
            <h3 className="font-bold mb-4">Customer Help</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">FAQ</Link></li>
              <li><Link href="#" className="hover:text-primary">Shipping & Delivery</Link></li>
              <li><Link href="#" className="hover:text-primary">Return & Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Order Tracking</Link></li>
            </ul>
          </div>

          {/* Policies Section */}
          <div>
            <h3 className="font-bold mb-4">Policies</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-primary">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Social & Support Section */}
          <div>
            <h3 className="font-bold mb-4">Social & Support</h3>
            <div className="flex space-x-4 mb-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>support@giftopia.com</p>
              <p>+1 (234) 567-890</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
           <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Gift className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">Giftopia</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Giftopia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
