"use client";

import { useTransition } from "react";
import { deleteRecipeAction } from "@/lib/actions";

interface DeleteRecipeButtonProps {
  recipeId: string;
  recipeTitle: string;
}

export function DeleteRecipeButton({
  recipeId,
  recipeTitle,
}: DeleteRecipeButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${recipeTitle}"? This cannot be undone.`
    );
    if (!confirmed) return;
    startTransition(() => deleteRecipeAction(recipeId));
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/50"
    >
      {isPending ? "Deleting..." : "Delete recipe"}
    </button>
  );
}
