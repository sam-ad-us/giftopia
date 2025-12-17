
import Link from 'next/link';
import { Gift, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="#" className="hover:text-sidebar-primary">About Us</Link></li>
              <li><Link href="/support" className="hover:text-sidebar-primary">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-sidebar-primary">Careers</Link></li>
              <li><Link href="#" className="hover:text-sidebar-primary">Gift Shop Info</Link></li>
            </ul>
          </div>

          {/* Customer Help Section */}
          <div>
            <h3 className="font-bold mb-4">Customer Help</h3>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/support" className="hover:text-sidebar-primary">Support</Link></li>
              <li><Link href="/faq" className="hover:text-sidebar-primary">FAQ</Link></li>
              <li><Link href="#" className="hover:text-sidebar-primary">Shipping & Delivery</Link></li>
              <li><Link href="#" className="hover:text-sidebar-primary">Return & Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-sidebar-primary">Order Tracking</Link></li>
            </ul>
          </div>

          {/* Policies Section */}
          <div>
            <h3 className="font-bold mb-4">Policies</h3>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/privacy-policy" className="hover:text-sidebar-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-sidebar-primary">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-sidebar-primary">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Social & Support Section */}
          <div>
            <h3 className="font-bold mb-4">Social & Support</h3>
            <div className="flex space-x-4 mb-4">
              <Link href="#" className="text-sidebar-foreground/70 hover:text-sidebar-primary"><Facebook size={20} /></Link>
              <Link href="#" className="text-sidebar-foreground/70 hover:text-sidebar-primary"><Twitter size={20} /></Link>
              <Link href="#" className="text-sidebar-foreground/70 hover:text-sidebar-primary"><Instagram size={20} /></Link>
            </div>
            <div className="text-sm text-sidebar-foreground/70">
              <p>support@giftopia.com</p>
              <p>+1 (234) 567-890</p>
            </div>
          </div>
        </div>

        <div className="border-t border-sidebar-border pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
           <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-sidebar-primary" />
            <span className="font-headline text-xl font-bold text-sidebar-primary">Giftopia</span>
          </div>
          <p className="text-sm text-sidebar-foreground/70">
            &copy; {new Date().getFullYear()} Giftopia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
