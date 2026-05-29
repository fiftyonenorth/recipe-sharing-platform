import { createClient } from "@/lib/supabase/server";

function socialQueryError(context: string, message: string): Error {
  if (
    message.includes("recipe_likes") &&
    (message.includes("does not exist") || message.includes("schema cache"))
  ) {
    return new Error(
      `${context}: likes are not set up in the database. Run supabase/migrations/20260526120000_recipe_likes_and_comments.sql`
    );
  }
  return new Error(`${context}: ${message}`);
}

export async function getRecipeLikeCount(recipeId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("recipe_likes")
    .select("*", { count: "exact", head: true })
    .eq("recipe_id", recipeId);

  if (error) {
    throw socialQueryError("Failed to count likes", error.message);
  }

  return count ?? 0;
}

export async function getLikeCountsForRecipes(
  recipeIds: string[]
): Promise<Record<string, number>> {
  if (recipeIds.length === 0) {
    return {};
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipe_likes")
    .select("recipe_id")
    .in("recipe_id", recipeIds);

  if (error) {
    throw socialQueryError("Failed to count likes", error.message);
  }

  const counts = Object.fromEntries(recipeIds.map((id) => [id, 0]));

  for (const row of data ?? []) {
    counts[row.recipe_id] = (counts[row.recipe_id] ?? 0) + 1;
  }

  return counts;
}

export async function hasUserLikedRecipe(
  recipeId: string,
  userId: string | null | undefined
): Promise<boolean> {
  if (!userId) {
    return false;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipe_likes")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw socialQueryError("Failed to check like", error.message);
  }

  return data !== null;
}

export async function getLikedRecipeIdsForUser(
  recipeIds: string[],
  userId: string
): Promise<Set<string>> {
  if (recipeIds.length === 0) {
    return new Set();
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipe_likes")
    .select("recipe_id")
    .eq("user_id", userId)
    .in("recipe_id", recipeIds);

  if (error) {
    throw socialQueryError("Failed to load likes", error.message);
  }

  return new Set((data ?? []).map((row) => row.recipe_id));
}

export async function likeRecipe(recipeId: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to like a recipe.");
  }

  const { error } = await supabase.from("recipe_likes").insert({
    user_id: user.id,
    recipe_id: recipeId,
  });

  if (error) {
    if (error.code === "23505") {
      return;
    }
    throw socialQueryError("Failed to like recipe", error.message);
  }
}

export async function unlikeRecipe(recipeId: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to unlike a recipe.");
  }

  const { error } = await supabase
    .from("recipe_likes")
    .delete()
    .eq("recipe_id", recipeId)
    .eq("user_id", user.id);

  if (error) {
    throw socialQueryError("Failed to unlike recipe", error.message);
  }
}
