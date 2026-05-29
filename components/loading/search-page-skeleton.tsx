import { PageShell } from "@/components/loading/page-shell";
import { RecipeGridSkeleton } from "@/components/loading/recipe-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchPageSkeleton() {
  return (
    <PageShell mainClassName="max-w-6xl">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>

      <div className="mb-10 flex max-w-xl gap-2">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="h-12 w-24 rounded-full" />
      </div>

      <Skeleton className="mb-6 h-4 w-40" />
      <RecipeGridSkeleton count={6} />
    </PageShell>
  );
}
