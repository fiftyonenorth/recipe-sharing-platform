import { CategoryBadge } from "@/components/category-badge";
import { DifficultyBadge } from "@/components/difficulty-badge";
import type { Recipe } from "@/lib/types";
import { formatMinutes } from "@/lib/utils";

interface RecipeMetaProps {
  recipe: Recipe;
}

export function RecipeMeta({ recipe }: RecipeMetaProps) {
  return (
    <dl className="flex flex-wrap gap-4 text-sm">
      {recipe.cooking_time != null && (
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs uppercase tracking-wide text-stone-500">
            Cooking time
          </dt>
          <dd className="font-medium text-stone-900 dark:text-stone-100">
            {formatMinutes(recipe.cooking_time)}
          </dd>
        </div>
      )}
      {recipe.category && (
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs uppercase tracking-wide text-stone-500">
            Category
          </dt>
          <dd>
            <CategoryBadge category={recipe.category} />
          </dd>
        </div>
      )}
      {recipe.difficulty && (
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs uppercase tracking-wide text-stone-500">
            Difficulty
          </dt>
          <dd>
            <DifficultyBadge difficulty={recipe.difficulty} />
          </dd>
        </div>
      )}
    </dl>
  );
}
