import Link from "next/link";
import { Header } from "@/components/header";
import { RecipeForm } from "@/components/recipe-form";
import { createRecipeAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";

export const metadata = {
  title: "Share a recipe — RecipeShare",
  description: "Publish a new recipe for the community.",
};

export default async function NewRecipePage() {
  await requireUser();

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 dark:hover:text-stone-50"
        >
          <span aria-hidden>←</span> Back to dashboard
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Share a recipe
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Add your ingredients and steps so others can cook along.
        </p>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 dark:border-stone-800 dark:bg-stone-900">
          <RecipeForm action={createRecipeAction} submitLabel="Publish recipe" />
        </div>
      </main>
    </div>
  );
}
