import { PageShell } from "@/components/loading/page-shell";
import { RecipeGridSkeleton } from "@/components/loading/recipe-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardPageSkeleton() {
  return (
    <PageShell mainClassName="max-w-6xl">
      <div className="mb-10 space-y-3">
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <div className="flex flex-col gap-14">
        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
          <RecipeGridSkeleton count={3} />
        </section>

        <section>
          <div className="mb-6 space-y-2">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-4 w-52" />
          </div>
          <RecipeGridSkeleton count={6} />
        </section>
      </div>
    </PageShell>
  );
}
