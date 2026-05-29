import { CommentForm, CommentSignInPrompt } from "@/components/social/comment-form";
import { CommentItem } from "@/components/social/comment-item";
import type { RecipeComment } from "@/lib/types";

interface RecipeCommentsSectionProps {
  recipeId: string;
  comments: RecipeComment[];
  currentUserId: string | null;
}

export function RecipeCommentsSection({
  recipeId,
  comments,
  currentUserId,
}: RecipeCommentsSectionProps) {
  const isAuthenticated = Boolean(currentUserId);

  return (
    <section
      id="comments"
      aria-labelledby="comments-heading"
      className="mt-12 border-t border-stone-200 pt-10 dark:border-stone-800"
    >
      <h2
        id="comments-heading"
        className="text-lg font-semibold text-stone-900 dark:text-stone-50"
      >
        Comments ({comments.length})
      </h2>

      <div className="mt-6">
        {isAuthenticated ? (
          <CommentForm key={comments.length} recipeId={recipeId} />
        ) : (
          <CommentSignInPrompt recipeId={recipeId} />
        )}
      </div>

      {comments.length === 0 ? (
        <p className="mt-8 text-sm text-stone-500 dark:text-stone-400">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="mt-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              recipeId={recipeId}
              isOwner={currentUserId === comment.user_id}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
