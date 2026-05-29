"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createCommentAction } from "@/lib/actions/social";
import { COMMENT_BODY_MAX_LENGTH } from "@/lib/social/constants";

interface CommentFormProps {
  recipeId: string;
}

const textareaClass =
  "w-full resize-y rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100";

export function CommentForm({ recipeId }: CommentFormProps) {
  const [state, formAction, isPending] = useActionState(
    createCommentAction.bind(null, recipeId),
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
          Add a comment
        </span>
        <textarea
          name="body"
          required
          rows={3}
          maxLength={COMMENT_BODY_MAX_LENGTH}
          placeholder="Share a tip, substitution, or how it turned out…"
          className={textareaClass}
          disabled={isPending}
        />
      </label>
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
        >
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600 disabled:opacity-60"
      >
        {isPending ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}

interface CommentSignInPromptProps {
  recipeId: string;
}

export function CommentSignInPrompt({ recipeId }: CommentSignInPromptProps) {
  return (
    <p className="rounded-lg border border-dashed border-stone-300 bg-white px-4 py-3 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
      <Link
        href={`/login?next=/recipes/${recipeId}`}
        className="font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400"
      >
        Sign in
      </Link>{" "}
      to join the conversation.
    </p>
  );
}
