'use client';

import Link from 'next/link';
import { Gift, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import CartIcon from './CartIcon';
import { useUser } from '@/firebase';
import UserNav from './UserNav';
import { Skeleton } from './ui/skeleton';

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
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search gifts..." className="pl-10 w-48 lg:w-64 bg-background text-foreground" />
          </div>
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
