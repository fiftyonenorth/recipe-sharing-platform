import Link from "next/link";
import { Header } from "@/components/header";
import { RecipeGrid } from "@/components/recipe-grid";
import { RecipeSearchForm } from "@/components/search/recipe-search-form";
import { getCurrentUser } from "@/lib/auth";
import { getAllRecipes } from "@/lib/recipes";
import { loadSocialStatsSafely } from "@/lib/social";
import type { RecipeSocialStats } from "@/lib/types";

export const metadata = {
  title: "Search recipes — RecipeShare",
  description: "Search community recipes by title, ingredients, and more.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const user = await getCurrentUser();

  let recipes: Awaited<ReturnType<typeof getAllRecipes>> = [];
  let socialStatsByRecipeId: Record<string, RecipeSocialStats> = {};
  let loadError: string | null = null;

  if (query) {
    try {
      recipes = await getAllRecipes({ query });
      socialStatsByRecipeId = await loadSocialStatsSafely(
        recipes.map((r) => r.id),
        user?.id
      );
    } catch (error) {
      loadError =
        error instanceof Error ? error.message : "Failed to search recipes";
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            Search recipes
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Find dishes by title, ingredient, author, or instructions.
          </p>
        </div>

        <RecipeSearchForm defaultQuery={query} className="mb-10 max-w-xl" />

        {loadError && (
          <p className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
            {loadError}
          </p>
        )}

        {!query && !loadError && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center dark:border-stone-700 dark:bg-stone-900">
            <p className="text-4xl" aria-hidden>
              🔍
            </p>
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
              Enter a keyword above to search the community cookbook.
            </p>
          </div>
        )}

        {query && !loadError && recipes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center dark:border-stone-700 dark:bg-stone-900">
            <p className="text-4xl" aria-hidden>
              🍳
            </p>
            <h2 className="mt-3 text-lg font-semibold text-stone-900 dark:text-stone-50">
              No recipes found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-stone-600 dark:text-stone-400">
              Nothing matched &ldquo;{query}&rdquo;. Try a different keyword or
              browse the dashboard.
            </p>
            {user && (
              <Link
                href="/dashboard"
                className="mt-6 inline-flex rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 dark:border-stone-600 dark:text-stone-100 dark:hover:bg-stone-800"
              >
                Go to dashboard
              </Link>
            )}
          </div>
        )}

        {query && !loadError && recipes.length > 0 && (
          <section aria-labelledby="search-results-heading">
            <h2
              id="search-results-heading"
              className="mb-6 text-sm font-medium text-stone-600 dark:text-stone-400"
            >
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}{" "}
              for &ldquo;{query}&rdquo;
            </h2>
            <RecipeGrid
              recipes={recipes}
              socialStatsByRecipeId={socialStatsByRecipeId}
            />
          </section>
        )}
      </main>
    </div>
  );
}
