"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toggleLikeAction } from "@/lib/actions/social";

interface RecipeLikeButtonProps {
  recipeId: string;
  liked: boolean;
  likeCount: number;
  isAuthenticated: boolean;
}

export function RecipeLikeButton({
  recipeId,
  liked: initialLiked,
  likeCount: initialLikeCount,
  isAuthenticated,
}: RecipeLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [initialLiked, initialLikeCount]);

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleLikeAction(recipeId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setLiked(result.liked ?? false);
      setLikeCount(result.likeCount ?? likeCount);
      setError(null);
    });
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400">
          <span aria-hidden className="text-rose-500">
            ♥
          </span>
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
        <Link
          href={`/login?next=/recipes/${recipeId}`}
          className="text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400"
        >
          Sign in to like
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-pressed={liked}
        aria-label={liked ? "Unlike recipe" : "Like recipe"}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
          liked
            ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-950"
            : "border-stone-300 bg-white text-stone-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-rose-900 dark:hover:bg-rose-950/30"
        }`}
      >
        <span aria-hidden className={liked ? "text-rose-500" : ""}>
          {liked ? "♥" : "♡"}
        </span>
        {isPending
          ? "Updating…"
          : `${likeCount} ${likeCount === 1 ? "like" : "likes"}`}
      </button>
      {error && (
        <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}
