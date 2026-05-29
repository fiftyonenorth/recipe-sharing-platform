interface RecipeSearchFormProps {
  defaultQuery?: string;
  className?: string;
}

export function RecipeSearchForm({
  defaultQuery = "",
  className = "",
}: RecipeSearchFormProps) {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      className={className}
    >
      <label htmlFor="recipe-search" className="sr-only">
        Search recipes
      </label>
      <div className="flex overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 dark:border-stone-700 dark:bg-stone-900">
        <input
          id="recipe-search"
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="Search by title, ingredient, author…"
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-stone-50"
        />
        <button
          type="submit"
          className="shrink-0 bg-amber-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
        >
          Search
        </button>
      </div>
    </form>
  );
}
