import Link from 'next/link';
import { Gift } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Gift className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">Giftopia</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
            <Link href="/catalog/for-her" className="text-sm text-muted-foreground hover:text-foreground">For Her</Link>
            <Link href="/catalog/for-him" className="text-sm text-muted-foreground hover:text-foreground">For Him</Link>
            <Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground">Cart</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Giftopia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
