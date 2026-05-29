import Link from "next/link";
import { RecipeCommentsSection } from "@/components/social/recipe-comments-section";
import { RecipeLikeButton } from "@/components/social/recipe-like-button";
import type { RecipeComment, RecipeSocialStats } from "@/lib/types";

interface RecipeSocialSectionProps {
  recipeId: string;
  stats: RecipeSocialStats;
  comments: RecipeComment[];
  currentUserId: string | null;
  error?: string | null;
}

export function RecipeSocialSection({
  recipeId,
  stats,
  comments,
  currentUserId,
  error,
}: RecipeSocialSectionProps) {
  return (
    <>
      <section
        aria-label="Recipe engagement"
        className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-4 dark:border-stone-800 dark:bg-stone-900"
      >
        <RecipeLikeButton
          recipeId={recipeId}
          liked={stats.likedByCurrentUser}
          likeCount={stats.likeCount}
          isAuthenticated={Boolean(currentUserId)}
        />
        <Link
          href="#comments"
          className="text-sm font-medium text-stone-600 transition-colors hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400"
        >
          {stats.commentCount}{" "}
          {stats.commentCount === 1 ? "comment" : "comments"}
        </Link>
      </section>

      {error && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {error}
        </p>
      )}

      <RecipeCommentsSection
        recipeId={recipeId}
        comments={comments}
        currentUserId={currentUserId}
      />
    </>
  );
}
