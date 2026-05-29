import { RecipeCard } from "@/components/recipe-card";
import { getRecipeSocialStatsFromMap } from "@/lib/social";
import type { Recipe, RecipeSocialStats } from "@/lib/types";

interface RecipeGridProps {
  recipes: Recipe[];
  socialStatsByRecipeId?: Record<string, RecipeSocialStats>;
}

export function RecipeGrid({
  recipes,
  socialStatsByRecipeId,
}: RecipeGridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <RecipeCard
            recipe={recipe}
            socialStats={
              socialStatsByRecipeId
                ? getRecipeSocialStatsFromMap(socialStatsByRecipeId, recipe.id)
                : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}
