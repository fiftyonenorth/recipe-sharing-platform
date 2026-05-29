import Link from "next/link";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { CookingTimeBadge } from "@/components/recipe/cooking-time-badge";
import { RecipeCover } from "@/components/recipe/recipe-cover";
import { RecipeSocialStatsDisplay } from "@/components/social/recipe-social-stats";
import type { Recipe, RecipeSocialStats } from "@/lib/types";
import {
  DIFFICULTY_LABELS,
  formatMinutes,
  getCategoryLabel,
} from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  socialStats?: RecipeSocialStats;
}

const difficultyColors = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
} as const;

export function RecipeCard({ recipe, socialStats }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:border-amber-200 hover:shadow-md hover:shadow-amber-500/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <RecipeCover
          imageUrl={recipe.image_url}
          title={recipe.title}
          className="h-full w-full"
        />
        {recipe.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-stone-700 backdrop-blur-sm">
            {getCategoryLabel(recipe.category)}
          </span>
        )}
        {recipe.cooking_time != null && (
          <CookingTimeBadge
            minutes={recipe.cooking_time}
            className="absolute bottom-3 right-3"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h2 className="line-clamp-2 text-lg font-semibold text-stone-900 group-hover:text-amber-700">
            {recipe.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-stone-500">
            {recipe.ingredients.slice(0, 3).join(", ")}
            {recipe.ingredients.length > 3 ? "…" : ""}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-stone-500">
          {recipe.difficulty && (
            <>
              <span
                className={`rounded-full px-2 py-0.5 font-medium ${difficultyColors[recipe.difficulty]}`}
              >
                {DIFFICULTY_LABELS[recipe.difficulty]}
              </span>
              <span>·</span>
            </>
          )}
          {recipe.cooking_time != null && (
            <span className="inline-flex items-center gap-1">
              <span aria-hidden>⏱</span>
              {formatMinutes(recipe.cooking_time)}
            </span>
          )}
        </div>

        {(socialStats?.likeCount ?? 0) > 0 ||
        (socialStats?.commentCount ?? 0) > 0 ? (
          <RecipeSocialStatsDisplay stats={socialStats} />
        ) : null}

        <div className="flex items-center gap-2 border-t border-stone-100 pt-3 dark:border-stone-800">
          <ProfileAvatar
            name={recipe.author}
            avatarUrl={recipe.author_avatar_url}
            size="sm"
          />
          <span className="truncate text-xs text-stone-500">{recipe.author}</span>
        </div>
      </div>
    </Link>
  );
}
