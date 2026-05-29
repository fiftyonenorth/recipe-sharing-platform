import Link from "next/link";
import { RECIPE_CATEGORIES, DIFFICULTIES } from "@/lib/constants";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/lib/utils";

interface RecipeSearchProps {
  query?: string;
  category?: string;
  difficulty?: string;
}

export function RecipeSearch({
  query = "",
  category = "",
  difficulty = "",
}: RecipeSearchProps) {
  return (
    <form
      action="/"
      method="get"
      className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <label className="flex min-w-[200px] flex-1 flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
          Search
        </span>
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Title, ingredient, author..."
          className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none ring-amber-500/0 transition-shadow focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800"
        />
      </label>
      <label className="flex flex-col gap-1.5 sm:w-36">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
          Category
        </span>
        <select
          name="category"
          defaultValue={category}
          className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800"
        >
          <option value="">All</option>
          {RECIPE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 sm:w-32">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
          Difficulty
        </span>
        <select
          name="difficulty"
          defaultValue={difficulty}
          className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800"
        >
          <option value="">All</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABELS[d]}
            </option>
          ))}
        </select>
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Filter
        </button>
        {(query || category || difficulty) && (
          <Link
            href="/"
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
          >
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
