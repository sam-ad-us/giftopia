
'use client';

import Link from 'next/link';
import { Gift, Search } from 'lucide-react';
import { Button } from './ui/button';
import CartIcon from './CartIcon';
import { useUser } from '@/firebase';
import UserNav from './UserNav';
import { Skeleton } from './ui/skeleton';
import { SearchInput } from './SearchInput';

export default function Header() {
  const { user, isUserLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="h-7 w-7 text-sidebar-primary" />
            <span className="font-headline text-2xl font-bold text-sidebar-primary">Giftopia</span>
          </Link>
           <nav className="hidden md:flex items-center gap-1">
             <Button asChild variant="link" className="text-base text-sidebar-foreground/80 hover:text-sidebar-foreground">
              <Link href="/personalized-gifts">Personalized Gifts</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <SearchInput />
          </div>
           <Button asChild variant="ghost" size="icon" className="sm:hidden hover:bg-sidebar-accent">
             <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
           </Button>
          <CartIcon />
          {isUserLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <UserNav />
          ) : (
            <Button asChild variant="secondary" className="bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
