import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteRecipeButton } from "@/components/delete-recipe-button";
import { Header } from "@/components/header";
import { RecipeCover } from "@/components/recipe/recipe-cover";
import { RecipeMeta } from "@/components/recipe-meta";
import { RecipeSocialSection } from "@/components/social/recipe-social-section";
import { getCurrentUser } from "@/lib/auth";
import { getRecipeComments } from "@/lib/comments";
import { getRecipeById } from "@/lib/recipes";
import { getRecipeSocialStats } from "@/lib/social";
import type { RecipeComment, RecipeSocialStats } from "@/lib/types";
import { formatMinutes } from "@/lib/utils";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);
  return {
    title: recipe ? `${recipe.title} — RecipeShare` : "Recipe — RecipeShare",
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const [recipe, user] = await Promise.all([getRecipeById(id), getCurrentUser()]);

  if (!recipe) {
    notFound();
  }

  const isOwner = user?.id === recipe.user_id;

  let stats: RecipeSocialStats = {
    likeCount: 0,
    commentCount: 0,
    likedByCurrentUser: false,
  };
  let comments: RecipeComment[] = [];
  let socialError: string | null = null;

  try {
    [stats, comments] = await Promise.all([
      getRecipeSocialStats(id, user?.id),
      getRecipeComments(id),
    ]);
  } catch (error) {
    socialError =
      error instanceof Error
        ? error.message
        : "Likes and comments are unavailable.";
  }

  const createdAt = new Date(recipe.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href={user ? "/dashboard" : "/"}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 dark:hover:text-stone-50"
        >
          <span aria-hidden>←</span> Back
        </Link>

        <article>
          <div className="mb-8 overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800">
            <RecipeCover
              imageUrl={recipe.image_url}
              title={recipe.title}
              className="aspect-[16/9] w-full"
            />
          </div>

          <header className="border-b border-stone-200 pb-8 dark:border-stone-800">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              by {recipe.author}
              {recipe.cooking_time != null && (
                <> · {formatMinutes(recipe.cooking_time)}</>
              )}
              {" · "}
              {createdAt}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
              {recipe.title}
            </h1>
            <div className="mt-6">
              <RecipeMeta recipe={recipe} />
            </div>

            {isOwner && (
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800"
                >
                  Edit recipe
                </Link>
                <DeleteRecipeButton
                  recipeId={recipe.id}
                  recipeTitle={recipe.title}
                />
              </div>
            )}
          </header>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
              Ingredients
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-stone-700 dark:text-stone-300">
              {recipe.ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
              Instructions
            </h2>
            <ol className="mt-4 list-decimal space-y-4 pl-5 text-stone-700 dark:text-stone-300">
              {recipe.instructions.map((step) => (
                <li key={step} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <RecipeSocialSection
            recipeId={recipe.id}
            stats={stats}
            comments={comments}
            currentUserId={user?.id ?? null}
            error={socialError}
          />
        </article>
      </main>
    </div>
  );
}
