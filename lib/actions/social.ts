"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/lib/comments";
import {
  getRecipeLikeCount,
  hasUserLikedRecipe,
  likeRecipe,
  unlikeRecipe,
} from "@/lib/likes";
import { validateCommentBody } from "@/lib/social/validate";
import type { RecipeComment } from "@/lib/types";

export interface SocialActionState {
  error?: string;
}

export interface ToggleLikeResult extends SocialActionState {
  liked?: boolean;
  likeCount?: number;
}

function revalidateRecipe(recipeId: string) {
  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath("/dashboard");
  revalidatePath("/search");
  revalidatePath("/saved");
}

export async function toggleLikeAction(
  recipeId: string
): Promise<ToggleLikeResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to like a recipe." };
  }

  try {
    const alreadyLiked = await hasUserLikedRecipe(recipeId, user.id);

    if (alreadyLiked) {
      await unlikeRecipe(recipeId);
    } else {
      await likeRecipe(recipeId);
    }

    const [liked, likeCount] = await Promise.all([
      hasUserLikedRecipe(recipeId, user.id),
      getRecipeLikeCount(recipeId),
    ]);

    revalidateRecipe(recipeId);

    return { liked, likeCount };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update like.",
    };
  }
}

export async function createCommentAction(
  recipeId: string,
  _prev: SocialActionState,
  formData: FormData
): Promise<SocialActionState & { comment?: RecipeComment }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to comment." };
  }

  const rawBody = String(formData.get("body") ?? "");
  const parsed = validateCommentBody(rawBody);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  try {
    const comment = await createComment(recipeId, parsed.body);
    revalidateRecipe(recipeId);
    return { comment };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to post comment.",
    };
  }
}

export async function updateCommentAction(
  commentId: string,
  recipeId: string,
  _prev: SocialActionState,
  formData: FormData
): Promise<SocialActionState & { comment?: RecipeComment }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to edit a comment." };
  }

  const rawBody = String(formData.get("body") ?? "");
  const parsed = validateCommentBody(rawBody);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  try {
    const comment = await updateComment(commentId, parsed.body);
    if (!comment) {
      return { error: "Comment not found." };
    }

    revalidateRecipe(recipeId);
    return { comment };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update comment.",
    };
  }
}

export async function deleteCommentAction(
  commentId: string,
  recipeId: string
): Promise<SocialActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to delete a comment." };
  }

  try {
    const deleted = await deleteComment(commentId);
    if (!deleted) {
      return { error: "Comment not found." };
    }

    revalidateRecipe(recipeId);
    return {};
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete comment.",
    };
  }
}
