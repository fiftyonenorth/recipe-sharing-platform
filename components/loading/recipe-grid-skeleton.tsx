import { RecipeCardSkeleton } from "@/components/loading/recipe-card-skeleton";

interface RecipeGridSkeletonProps {
  count?: number;
}

export function RecipeGridSkeleton({ count = 6 }: RecipeGridSkeletonProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <RecipeCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
