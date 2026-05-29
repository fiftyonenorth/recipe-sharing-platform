import { getCategoryLabel } from "@/lib/utils";
import type { RecipeCategory } from "@/lib/types";

const CATEGORY_STYLES: Record<RecipeCategory, string> = {
  breakfast: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  lunch: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  dinner: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  dessert: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200",
  snack: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  drink: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
};

const DEFAULT_STYLE =
  "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200";

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const style =
    category in CATEGORY_STYLES
      ? CATEGORY_STYLES[category as RecipeCategory]
      : DEFAULT_STYLE;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {getCategoryLabel(category)}
    </span>
  );
}
