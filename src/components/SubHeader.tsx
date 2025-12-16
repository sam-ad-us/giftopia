

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Category } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

export default function SubHeader() {
  const pathname = usePathname();
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'categories'), where('showInSubHeader', '==', true)) : null),
    [firestore]
  );
  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  return (
    <div className="sticky top-16 z-40 w-full border-b bg-sub-header-background">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
            <nav className="flex items-center justify-center gap-6 text-sm font-medium h-12">
                {isLoading && (
                  <>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </>
                )}
                {categories?.map((category) => {
                const isActive = pathname === `/catalog/${category.id}`;
                return (
                    <Link
                    key={category.id}
                    href={`/catalog/${category.id}`}
                    className={cn(
                        "text-foreground/70 transition-colors hover:text-foreground whitespace-nowrap pb-2.5",
                        isActive && "text-foreground border-b-2 border-foreground"
                    )}
                    >
                    {category.name}
                    </Link>
                );
                })}
            </nav>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </div>
  );
}
