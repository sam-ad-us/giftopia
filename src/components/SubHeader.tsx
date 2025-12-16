

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function SubHeader() {
  const pathname = usePathname();

  // Exclude 'Personalized Gifts' since it's in the main header now.
  const subHeaderCategories = categories.filter(category => category.id !== 'personalized-gifts');

  return (
    <div className="sticky top-16 z-40 w-full border-b bg-sub-header-background">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
            <nav className="flex items-center justify-center gap-6 text-sm font-medium h-12">
                {subHeaderCategories.map((category) => {
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
