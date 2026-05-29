import {
  getCommentCountsForRecipes,
  getRecipeCommentCount,
} from "@/lib/comments";
import {
  getLikeCountsForRecipes,
  getLikedRecipeIdsForUser,
  getRecipeLikeCount,
  hasUserLikedRecipe,
} from "@/lib/likes";
import type { RecipeSocialStats } from "@/lib/types";

function emptyStats(): RecipeSocialStats {
  return {
    likeCount: 0,
    commentCount: 0,
    likedByCurrentUser: false,
  };
}

export async function getRecipeSocialStats(
  recipeId: string,
  userId?: string | null
): Promise<RecipeSocialStats> {
  const [likeCount, commentCount, likedByCurrentUser] = await Promise.all([
    getRecipeLikeCount(recipeId),
    getRecipeCommentCount(recipeId),
    hasUserLikedRecipe(recipeId, userId),
  ]);

  return { likeCount, commentCount, likedByCurrentUser };
}

export async function getSocialStatsForRecipes(
  recipeIds: string[],
  userId?: string | null
): Promise<Record<string, RecipeSocialStats>> {
  if (recipeIds.length === 0) {
    return {};
  }

  const [likeCounts, commentCounts, likedIds] = await Promise.all([
    getLikeCountsForRecipes(recipeIds),
    getCommentCountsForRecipes(recipeIds),
    userId
      ? getLikedRecipeIdsForUser(recipeIds, userId)
      : Promise.resolve(new Set<string>()),
  ]);

  return Object.fromEntries(
    recipeIds.map((id) => [
      id,
      {
        likeCount: likeCounts[id] ?? 0,
        commentCount: commentCounts[id] ?? 0,
        likedByCurrentUser: likedIds.has(id),
      },
    ])
  );
}

export function getRecipeSocialStatsFromMap(
  statsByRecipeId: Record<string, RecipeSocialStats>,
  recipeId: string
): RecipeSocialStats {
  return statsByRecipeId[recipeId] ?? emptyStats();
}

export async function loadSocialStatsSafely(
  recipeIds: string[],
  userId?: string | null
): Promise<Record<string, RecipeSocialStats>> {
  if (recipeIds.length === 0) {
    return {};
  }

  try {
    return await getSocialStatsForRecipes(recipeIds, userId);
  } catch {
    return {};
  }
}
