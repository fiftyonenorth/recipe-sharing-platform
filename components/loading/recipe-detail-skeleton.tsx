import { PageShell } from "@/components/loading/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

export function RecipeDetailSkeleton() {
  return (
    <PageShell mainClassName="max-w-3xl">
      <Skeleton className="mb-6 h-5 w-16" />

      <Skeleton className="mb-8 aspect-[16/9] w-full rounded-2xl" />

      <div className="space-y-4 border-b border-stone-200 pb-8 dark:border-stone-800">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-9 w-full max-w-lg" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <section className="mt-8 space-y-4">
        <Skeleton className="h-6 w-28" />
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-full max-w-md" />
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
