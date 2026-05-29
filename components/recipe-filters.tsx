"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { CATEGORY_LABELS } from "@/lib/utils";

const categories = [
  { value: "all", label: "All" },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

export function RecipeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return (
    <div
      className={`space-y-4 ${isPending ? "opacity-70" : ""}`}
      aria-busy={isPending}
    >
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Search recipes
        </label>
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          aria-hidden
        >
          🔍
        </span>
        <input
          id="search"
          type="search"
          placeholder="Search by title, ingredient, or author..."
          defaultValue={query}
          onChange={(e) => updateParams({ q: e.target.value })}
          className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => updateParams({ category: cat.value })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat.value
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
