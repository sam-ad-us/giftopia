import Link from 'next/link';
import { Gift, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Gift Shop Info</Link></li>
            </ul>
          </div>

          {/* Customer Help Section */}
          <div>
            <h3 className="font-bold mb-4">Customer Help</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white">Shipping & Delivery</Link></li>
              <li><Link href="#" className="hover:text-white">Return & Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Order Tracking</Link></li>
            </ul>
          </div>

          {/* Policies Section */}
          <div>
            <h3 className="font-bold mb-4">Policies</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-white">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Social & Support Section */}
          <div>
            <h3 className="font-bold mb-4">Social & Support</h3>
            <div className="flex space-x-4 mb-4">
              <Link href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></Link>
            </div>
            <div className="text-sm text-gray-400">
              <p>support@giftopia.com</p>
              <p>+1 (234) 567-890</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
           <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Gift className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">Giftopia</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Giftopia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
