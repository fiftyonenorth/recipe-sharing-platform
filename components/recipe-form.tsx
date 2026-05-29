"use client";

import { useActionState } from "react";
import { RecipeImageUploadField } from "@/components/recipe/recipe-image-upload-field";
import type { ActionState } from "@/lib/actions";
import { RECIPE_CATEGORIES, DIFFICULTIES } from "@/lib/constants";
import type { Recipe } from "@/lib/types";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/lib/utils";

interface RecipeFormProps {
  recipe?: Recipe;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800";

const labelClass =
  "text-xs font-medium uppercase tracking-wide text-stone-500";

export function RecipeForm({ recipe, action, submitLabel }: RecipeFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  const ingredients =
    recipe?.ingredients.length ? recipe.ingredients : [""];
  const instructions =
    recipe?.instructions.length ? recipe.instructions : [""];

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
        >
          {state.error}
        </p>
      )}

      <RecipeImageUploadField
        imageUrl={recipe?.image_url}
        title={recipe?.title ?? "Recipe"}
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          Basics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={labelClass}>Title *</span>
            <input
              name="title"
              required
              defaultValue={recipe?.title}
              className={inputClass}
              placeholder="e.g. Creamy Mushroom Risotto"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Category</span>
            <select
              name="category"
              defaultValue={recipe?.category ?? "dinner"}
              className={inputClass}
            >
              {RECIPE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Difficulty</span>
            <select
              name="difficulty"
              defaultValue={recipe?.difficulty ?? "medium"}
              className={inputClass}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {DIFFICULTY_LABELS[d]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Cooking time (minutes) *</span>
            <input
              name="cookingTime"
              type="number"
              min={1}
              step={1}
              required
              inputMode="numeric"
              defaultValue={recipe?.cooking_time ?? 30}
              className={inputClass}
              placeholder="e.g. 45"
            />
            <span className="text-xs text-stone-500">
              Active cooking time in minutes (prep not included).
            </span>
          </label>
        </div>
      </section>

      <DynamicList
        title="Ingredients"
        name="ingredients"
        placeholder="e.g. 2 cups flour"
        items={ingredients}
      />

      <DynamicList
        title="Instructions"
        name="instructions"
        placeholder="Describe this step..."
        items={instructions}
        multiline
      />

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 hover:bg-amber-600 disabled:opacity-60"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

interface DynamicListProps {
  title: string;
  name: string;
  placeholder: string;
  items: string[];
  multiline?: boolean;
}

function DynamicList({
  title,
  name,
  placeholder,
  items,
  multiline,
}: DynamicListProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
        {title}
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((value, index) => (
          <div key={`${name}-${index}`} className="flex gap-2">
            <span className="flex h-10 w-8 shrink-0 items-center justify-center text-sm font-medium text-stone-400">
              {index + 1}.
            </span>
            {multiline ? (
              <textarea
                name={name}
                defaultValue={value}
                rows={2}
                className={inputClass}
                placeholder={placeholder}
              />
            ) : (
              <input
                name={name}
                defaultValue={value}
                className={inputClass}
                placeholder={placeholder}
              />
            )}
          </div>
        ))}
        <div className="flex gap-2 pl-10">
          {multiline ? (
            <textarea
              name={name}
              rows={2}
              className={inputClass}
              placeholder={placeholder}
            />
          ) : (
            <input
              name={name}
              className={inputClass}
              placeholder={placeholder}
            />
          )}
        </div>
      </div>
    </section>
  );
}
