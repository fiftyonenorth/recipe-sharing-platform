import { PageShell } from "@/components/loading/page-shell";
import { RecipeGridSkeleton } from "@/components/loading/recipe-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function SavedPageSkeleton() {
  return (
    <PageShell mainClassName="max-w-6xl">
      <Skeleton className="mb-6 h-5 w-32" />
      <div className="mb-10 space-y-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72 max-w-full" />
      </div>
      <RecipeGridSkeleton count={6} />
    </PageShell>
  );
}
