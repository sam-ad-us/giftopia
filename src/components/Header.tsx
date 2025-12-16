
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="h-7 w-7 text-primary" />
            <span className="font-headline text-2xl font-bold text-foreground">Giftopia</span>
          </Link>
           <nav className="hidden md:flex items-center gap-1">
             <Button asChild variant="link" className="text-base text-muted-foreground hover:text-primary">
              <Link href="/personalized-gifts">Personalized Gifts</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
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
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <UserNav />
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
