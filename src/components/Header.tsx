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
    <header className="sticky top-0 z-50 w-full border-b border-primary-deeper/20 bg-primary-deeper text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="h-7 w-7 text-accent" />
            <span className="font-headline text-2xl font-bold">Giftopia</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <SearchInput />
          </div>
           <Button asChild variant="ghost" size="icon" className="sm:hidden">
             <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
           </Button>
          <CartIcon />
          {isUserLoading ? (
            <Skeleton className="h-8 w-16 bg-white/20" />
          ) : user ? (
            <UserNav />
          ) : (
            <Button asChild variant="secondary">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
