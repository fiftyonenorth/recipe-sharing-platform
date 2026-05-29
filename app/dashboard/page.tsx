import Link from "next/link";
import { Header } from "@/components/header";
import { RecipeGrid } from "@/components/recipe-grid";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import {
  getRecipesByUser,
  getRecipesFromOtherUsers,
} from "@/lib/recipes";
import { loadSocialStatsSafely } from "@/lib/social";
import type { Recipe, RecipeSocialStats } from "@/lib/types";

export const metadata = {
  title: "Dashboard — RecipeShare",
  description: "Your recipes and discoveries from the community.",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  const displayName =
    profile?.full_name?.trim() || profile?.username || "there";

  let myRecipes: Recipe[] = [];
  let communityRecipes: Recipe[] = [];
  let socialStatsByRecipeId: Record<string, RecipeSocialStats> = {};
  let loadError: string | null = null;

  try {
    [myRecipes, communityRecipes] = await Promise.all([
      getRecipesByUser(user.id),
      getRecipesFromOtherUsers(user.id),
    ]);

    const recipeIds = [...myRecipes, ...communityRecipes].map((r) => r.id);
    socialStatsByRecipeId = await loadSocialStatsSafely(recipeIds, user.id);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load recipes";
  }

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Manage your recipes and discover what others are cooking.
          </p>
        </div>

        {loadError && (
          <p className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
            {loadError}
          </p>
        )}

        {!loadError && (
          <div className="flex flex-col gap-14">
            <section aria-labelledby="my-recipes-heading">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2
                    id="my-recipes-heading"
                    className="text-xl font-semibold text-stone-900 dark:text-stone-50"
                  >
                    Your recipes
                  </h2>
                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                    Recipes you&apos;ve shared with the community.
                  </p>
                </div>
                <Link
                  href="/recipes/new"
                  className="inline-flex rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600"
                >
                  Share a recipe
                </Link>
              </div>

              {myRecipes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center dark:border-stone-700 dark:bg-stone-900">
                  <p className="text-4xl" aria-hidden>
                    📝
                  </p>
                  <h3 className="mt-3 text-base font-semibold text-stone-900 dark:text-stone-50">
                    No recipes yet
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-stone-600 dark:text-stone-400">
                    Share your first recipe and it will appear here.
                  </p>
                </div>
              ) : (
                <RecipeGrid
                  recipes={myRecipes}
                  socialStatsByRecipeId={socialStatsByRecipeId}
                />
              )}
            </section>

            <section aria-labelledby="community-recipes-heading">
              <div className="mb-6">
                <h2
                  id="community-recipes-heading"
                  className="text-xl font-semibold text-stone-900 dark:text-stone-50"
                >
                  From the community
                </h2>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                  Recipes from other home cooks.
                </p>
              </div>

              {communityRecipes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center dark:border-stone-700 dark:bg-stone-900">
                  <p className="text-4xl" aria-hidden>
                    🍳
                  </p>
                  <h3 className="mt-3 text-base font-semibold text-stone-900 dark:text-stone-50">
                    No community recipes yet
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-stone-600 dark:text-stone-400">
                    When other members share recipes, they&apos;ll show up here.
                  </p>
                </div>
              ) : (
                <RecipeGrid
                  recipes={communityRecipes}
                  socialStatsByRecipeId={socialStatsByRecipeId}
                />
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
