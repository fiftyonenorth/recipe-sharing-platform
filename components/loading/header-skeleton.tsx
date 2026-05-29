import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Skeleton className="hidden h-9 w-20 sm:block" />
          <Skeleton className="hidden h-9 w-16 sm:block" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </header>
  );
}
