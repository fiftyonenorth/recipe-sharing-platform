import { createClient } from "@/lib/supabase/server";
import { validateCommentBody } from "@/lib/social/validate";
import type { RecipeComment } from "@/lib/types";
import type { Database } from "@/types/database.types";

type CommentRow = Database["public"]["Tables"]["recipe_comments"]["Row"];
type ProfileSnippet = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "username" | "full_name" | "avatar_url"
>;

type CommentWithProfile = CommentRow & {
  profiles: ProfileSnippet | ProfileSnippet[] | null;
};

function socialQueryError(context: string, message: string): Error {
  if (
    message.includes("recipe_comments") &&
    (message.includes("does not exist") || message.includes("schema cache"))
  ) {
    return new Error(
      `${context}: comments are not set up in the database. Run supabase/migrations/20260526120000_recipe_likes_and_comments.sql`
    );
  }
  return new Error(`${context}: ${message}`);
}

const COMMENT_SELECT = `
  id,
  created_at,
  updated_at,
  user_id,
  recipe_id,
  body,
  profiles (
    username,
    full_name,
    avatar_url
  )
`;

function mapComment(row: CommentWithProfile): RecipeComment {
  const profile = Array.isArray(row.profiles)
    ? row.profiles[0]
    : row.profiles;

  const author =
    profile?.full_name?.trim() ||
    profile?.username ||
    "Unknown cook";

  return {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id,
    recipe_id: row.recipe_id,
    body: row.body,
    author,
    author_avatar_url: profile?.avatar_url ?? null,
  };
}

export async function getRecipeComments(
  recipeId: string
): Promise<RecipeComment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipe_comments")
    .select(COMMENT_SELECT)
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: true });

  if (error) {
    throw socialQueryError("Failed to load comments", error.message);
  }

  return (data as CommentWithProfile[]).map(mapComment);
}

export async function getRecipeCommentCount(recipeId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("recipe_comments")
    .select("*", { count: "exact", head: true })
    .eq("recipe_id", recipeId);

  if (error) {
    throw socialQueryError("Failed to count comments", error.message);
  }

  return count ?? 0;
}

export async function getCommentCountsForRecipes(
  recipeIds: string[]
): Promise<Record<string, number>> {
  if (recipeIds.length === 0) {
    return {};
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipe_comments")
    .select("recipe_id")
    .in("recipe_id", recipeIds);

  if (error) {
    throw socialQueryError("Failed to count comments", error.message);
  }

  const counts = Object.fromEntries(recipeIds.map((id) => [id, 0]));

  for (const row of data ?? []) {
    counts[row.recipe_id] = (counts[row.recipe_id] ?? 0) + 1;
  }

  return counts;
}

export async function createComment(
  recipeId: string,
  body: string
): Promise<RecipeComment> {
  const parsed = validateCommentBody(body);
  if ("error" in parsed) {
    throw new Error(parsed.error);
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to comment.");
  }

  const { data, error } = await supabase
    .from("recipe_comments")
    .insert({
      user_id: user.id,
      recipe_id: recipeId,
      body: parsed.body,
    })
    .select(COMMENT_SELECT)
    .single();

  if (error) {
    throw socialQueryError("Failed to post comment", error.message);
  }

  return mapComment(data as CommentWithProfile);
}

export async function updateComment(
  commentId: string,
  body: string
): Promise<RecipeComment | null> {
  const parsed = validateCommentBody(body);
  if ("error" in parsed) {
    throw new Error(parsed.error);
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to edit a comment.");
  }

  const { data, error } = await supabase
    .from("recipe_comments")
    .update({ body: parsed.body })
    .eq("id", commentId)
    .eq("user_id", user.id)
    .select(COMMENT_SELECT)
    .maybeSingle();

  if (error) {
    throw socialQueryError("Failed to update comment", error.message);
  }

  if (!data) {
    return null;
  }

  return mapComment(data as CommentWithProfile);
}

export async function deleteComment(commentId: string): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to delete a comment.");
  }

  const { error, count } = await supabase
    .from("recipe_comments")
    .delete({ count: "exact" })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    throw socialQueryError("Failed to delete comment", error.message);
  }

  return (count ?? 0) > 0;
}
