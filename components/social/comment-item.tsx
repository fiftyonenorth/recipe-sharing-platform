"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import {
  deleteCommentAction,
  updateCommentAction,
} from "@/lib/actions/social";
import { formatCommentDate } from "@/lib/social/format";
import { COMMENT_BODY_MAX_LENGTH } from "@/lib/social/constants";
import type { RecipeComment } from "@/lib/types";

interface CommentItemProps {
  comment: RecipeComment;
  recipeId: string;
  isOwner: boolean;
}

const textareaClass =
  "w-full resize-y rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100";

export function CommentItem({ comment, recipeId, isOwner }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const updateAction = updateCommentAction.bind(null, comment.id, recipeId);
  const [state, formAction, isPending] = useActionState(updateAction, {});

  useEffect(() => {
    if (state.comment && !state.error) {
      setIsEditing(false);
    }
  }, [state]);

  const displayBody = state.comment?.body ?? comment.body;
  const wasEdited =
    comment.created_at !== comment.updated_at ||
    (state.comment && state.comment.updated_at !== comment.created_at);

  function handleDelete() {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;

    startDeleteTransition(async () => {
      const result = await deleteCommentAction(comment.id, recipeId);
      if (result.error) {
        setDeleteError(result.error);
      }
    });
  }

  return (
    <li className="flex gap-3 border-b border-stone-100 py-4 last:border-0 dark:border-stone-800">
      <ProfileAvatar
        name={comment.author}
        avatarUrl={comment.author_avatar_url}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-stone-900 dark:text-stone-50">
            {comment.author}
          </span>
          <time
            dateTime={comment.created_at}
            className="text-xs text-stone-500 dark:text-stone-400"
          >
            {formatCommentDate(comment.created_at)}
            {wasEdited && " · edited"}
          </time>
        </div>

        {isEditing ? (
          <form action={formAction} className="mt-3 flex flex-col gap-3">
            <textarea
              name="body"
              required
              rows={3}
              maxLength={COMMENT_BODY_MAX_LENGTH}
              defaultValue={displayBody}
              className={textareaClass}
              disabled={isPending}
            />
            {state.error && (
              <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
                {state.error}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {displayBody}
          </p>
        )}

        {isOwner && !isEditing && (
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-60 dark:text-rose-400"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}

        {deleteError && (
          <p role="alert" className="mt-2 text-sm text-rose-600 dark:text-rose-400">
            {deleteError}
          </p>
        )}
      </div>
    </li>
  );
}
