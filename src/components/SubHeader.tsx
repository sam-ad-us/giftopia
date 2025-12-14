"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function SubHeader() {
  const pathname = usePathname();

  return (
    <div className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
            <nav className="flex items-center gap-6 text-sm font-medium h-12">
                {categories.map((category) => {
                const isActive = pathname === `/catalog/${category.id}`;
                return (
                    <Link
                    key={category.id}
                    href={`/catalog/${category.id}`}
                    className={cn(
                        "text-muted-foreground transition-colors hover:text-primary whitespace-nowrap pb-2.5",
                        isActive && "text-primary border-b-2 border-primary"
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
