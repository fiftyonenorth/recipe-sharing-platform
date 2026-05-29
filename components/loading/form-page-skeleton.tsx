import { PageShell } from "@/components/loading/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

interface FormPageSkeletonProps {
  fieldCount?: number;
}

export function FormPageSkeleton({ fieldCount = 8 }: FormPageSkeletonProps) {
  return (
    <PageShell mainClassName="max-w-2xl">
      <Skeleton className="mb-6 h-5 w-36" />
      <div className="space-y-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="mt-8 space-y-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 dark:border-stone-800 dark:bg-stone-900">
        <Skeleton className="aspect-video w-full rounded-xl" />
        {Array.from({ length: fieldCount }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-11 w-36 rounded-full" />
      </div>
    </PageShell>
  );
}
