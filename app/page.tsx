import Link from "next/link";
import { Header } from "@/components/header";
import { RecipeSearchForm } from "@/components/search/recipe-search-form";

export const metadata = {
  title: "RecipeShare — Discover & share home-cooked recipes",
  description:
    "A community-driven recipe platform. Browse dishes from home cooks, share your own, and save favorites for later.",
};

const features = [
  {
    title: "Discover",
    description:
      "Search and filter by cuisine, diet, difficulty, and prep time to find your next meal.",
    icon: "🔍",
  },
  {
    title: "Share",
    description:
      "Publish recipes with ingredients, step-by-step instructions, and cover photos.",
    icon: "✨",
  },
  {
    title: "Save & rate",
    description:
      "Bookmark recipes into collections and rate dishes from the community.",
    icon: "⭐",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />

      <main className="flex-1">
        <section className="border-b border-stone-200/80 bg-gradient-to-b from-amber-50/80 via-white to-stone-50 dark:border-stone-800 dark:from-amber-950/20 dark:via-stone-950 dark:to-stone-950">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Community recipe sharing
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
                Cook, share, and discover recipes you&apos;ll love
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-stone-600 dark:text-stone-400">
                RecipeShare is where home cooks publish their best dishes,
                explore new flavors, and build collections of go-to meals.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/search"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-amber-500 px-8 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600 sm:w-auto"
                >
                  Browse recipes
                </Link>
                <Link
                  href="/recipes/new"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-stone-300 bg-white px-8 text-sm font-semibold text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50 sm:w-auto dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800"
                >
                  Share your recipe
                </Link>
              </div>
            </div>

            <RecipeSearchForm className="mx-auto mt-12 max-w-xl" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <ul className="grid gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
              >
                <span className="text-2xl" aria-hidden>
                  {feature.icon}
                </span>
                <h2 className="mt-3 text-lg font-semibold text-stone-900 dark:text-stone-50">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 px-6 py-12 text-center text-white sm:px-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to share your kitchen?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-amber-50/90">
              Create a free account to publish recipes, save favorites, and rate
              dishes from the community.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 sm:w-auto"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white py-8 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-stone-500 sm:flex-row sm:px-6 dark:text-stone-400">
          <p>© {new Date().getFullYear()} RecipeShare</p>
          <p className="text-center sm:text-right">
            Built for home cooks — powered by Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
}
