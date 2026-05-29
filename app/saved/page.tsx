import Link from "next/link";
import { Header } from "@/components/header";
import { RecipeGrid } from "@/components/recipe-grid";
import { requireUser } from "@/lib/auth";
import { getRecipesLikedByUser } from "@/lib/recipes";
import { loadSocialStatsSafely } from "@/lib/social";
import type { Recipe, RecipeSocialStats } from "@/lib/types";

export const metadata = {
  title: "Saved recipes — RecipeShare",
  description: "Recipes you've liked and saved for later.",
};

export default async function SavedPage() {
  const user = await requireUser();

  let recipes: Recipe[] = [];
  let socialStatsByRecipeId: Record<string, RecipeSocialStats> = {};
  let loadError: string | null = null;

  try {
    recipes = await getRecipesLikedByUser(user.id);
    socialStatsByRecipeId = await loadSocialStatsSafely(
      recipes.map((r) => r.id),
      user.id
    );
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load saved recipes";
  }

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 dark:hover:text-stone-50"
        >
          <span aria-hidden>←</span> Back to profile
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            Saved recipes
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Every recipe you&apos;ve liked, ready when you are.
          </p>
        </div>

        {loadError && (
          <p className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
            {loadError}
          </p>
        )}

        {!loadError && recipes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center dark:border-stone-700 dark:bg-stone-900">
            <p className="text-4xl" aria-hidden>
              ♥
            </p>
            <h2 className="mt-3 text-lg font-semibold text-stone-900 dark:text-stone-50">
              No saved recipes yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-stone-600 dark:text-stone-400">
              Like recipes you enjoy and they&apos;ll show up here for easy
              access.
            </p>
            <Link
              href="/search"
              className="mt-6 inline-flex rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600"
            >
              Browse recipes
            </Link>
          </div>
        )}

        {!loadError && recipes.length > 0 && (
          <RecipeGrid
            recipes={recipes}
            socialStatsByRecipeId={socialStatsByRecipeId}
          />
        )}
      </main>
    </div>
  );
}
