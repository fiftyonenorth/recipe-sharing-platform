import { createClient } from "@/lib/supabase/server";
import { deleteRecipeImages } from "@/lib/recipe-images";
import type { Difficulty, Recipe, RecipeInput } from "@/lib/types";
import type { Database } from "@/types/database.types";

type RecipeRow = Database["public"]["Tables"]["recipes"]["Row"];
type ProfileSnippet = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "username" | "full_name" | "avatar_url"
>;

type RecipeWithProfile = RecipeRow & {
  profiles: ProfileSnippet | ProfileSnippet[] | null;
};

function recipeQueryError(context: string, message: string): Error {
  if (message.includes("image_url") && message.includes("does not exist")) {
    return new Error(
      `${context}: recipe photos are not set up in the database. Open Supabase → SQL Editor and run supabase/migrations/20250520120000_recipe_images_storage.sql`
    );
  }
  return new Error(`${context}: ${message}`);
}

const RECIPE_SELECT = `
  id,
  created_at,
  user_id,
  title,
  ingredients,
  instructions,
  cooking_time,
  difficulty,
  category,
  image_url,
  profiles (
    username,
    full_name,
    avatar_url
  )
`;

function mapRecipe(row: RecipeWithProfile): Recipe {
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
    user_id: row.user_id,
    title: row.title,
    ingredients: row.ingredients,
    instructions: row.instructions,
    cooking_time: row.cooking_time,
    difficulty: row.difficulty as Difficulty | null,
    category: row.category,
    author,
    author_avatar_url: profile?.avatar_url ?? null,
    image_url: row.image_url ?? null,
  };
}

export async function getRecipesLikedByUser(userId: string): Promise<Recipe[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipe_likes")
    .select(`created_at, recipes (${RECIPE_SELECT})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    if (
      messageIncludesLikesTableMissing(error.message)
    ) {
      throw new Error(
        "Failed to load saved recipes: likes are not set up in the database. Run supabase/migrations/20260526120000_recipe_likes_and_comments.sql"
      );
    }
    throw recipeQueryError("Failed to load saved recipes", error.message);
  }

  return (data ?? [])
    .map((row) => {
      const recipe = Array.isArray(row.recipes) ? row.recipes[0] : row.recipes;
      return recipe ? mapRecipe(recipe as RecipeWithProfile) : null;
    })
    .filter((recipe): recipe is Recipe => recipe !== null);
}

function messageIncludesLikesTableMissing(message: string): boolean {
  return (
    message.includes("recipe_likes") &&
    (message.includes("does not exist") || message.includes("schema cache"))
  );
}

export async function getRecipesByUser(
  userId: string,
  filters?: RecipeFilters
): Promise<Recipe[]> {
  const supabase = await createClient();

  let query = supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.difficulty) {
    query = query.eq("difficulty", filters.difficulty as Difficulty);
  }

  const { data, error } = await query;

  if (error) {
    throw recipeQueryError("Failed to load recipes", error.message);
  }

  const recipes = (data as RecipeWithProfile[]).map(mapRecipe);

  if (!filters?.query) {
    return recipes;
  }

  return filterRecipes(recipes, { query: filters.query });
}

export async function getRecipesFromOtherUsers(
  currentUserId: string,
  filters?: RecipeFilters
): Promise<Recipe[]> {
  const supabase = await createClient();

  let query = supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .neq("user_id", currentUserId)
    .order("created_at", { ascending: false });

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.difficulty) {
    query = query.eq("difficulty", filters.difficulty as Difficulty);
  }

  const { data, error } = await query;

  if (error) {
    throw recipeQueryError("Failed to load recipes", error.message);
  }

  const recipes = (data as RecipeWithProfile[]).map(mapRecipe);

  if (!filters?.query) {
    return recipes;
  }

  return filterRecipes(recipes, { query: filters.query });
}

export async function getAllRecipes(
  filters?: RecipeFilters
): Promise<Recipe[]> {
  const supabase = await createClient();

  let query = supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .order("created_at", { ascending: false });

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.difficulty) {
    query = query.eq("difficulty", filters.difficulty as Difficulty);
  }

  const { data, error } = await query;

  if (error) {
    throw recipeQueryError("Failed to load recipes", error.message);
  }

  const recipes = (data as RecipeWithProfile[]).map(mapRecipe);

  if (!filters?.query) {
    return recipes;
  }

  return filterRecipes(recipes, { query: filters.query });
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw recipeQueryError("Failed to load recipe", error.message);
  }

  if (!data) {
    return null;
  }

  return mapRecipe(data as RecipeWithProfile);
}

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to create a recipe.");
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      title: input.title,
      ingredients: input.ingredients,
      instructions: input.instructions,
      cooking_time: input.cooking_time ?? null,
      difficulty: input.difficulty ?? null,
      category: input.category ?? null,
    })
    .select(RECIPE_SELECT)
    .single();

  if (error) {
    throw new Error(`Failed to create recipe: ${error.message}`);
  }

  return mapRecipe(data as RecipeWithProfile);
}

export async function updateRecipe(
  id: string,
  input: RecipeInput
): Promise<Recipe | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to update a recipe.");
  }

  const { data, error } = await supabase
    .from("recipes")
    .update({
      title: input.title,
      ingredients: input.ingredients,
      instructions: input.instructions,
      cooking_time: input.cooking_time ?? null,
      difficulty: input.difficulty ?? null,
      category: input.category ?? null,
    })
    .eq("id", id)
    .select(RECIPE_SELECT)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update recipe: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapRecipe(data as RecipeWithProfile);
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to delete a recipe.");
  }

  await deleteRecipeImages(id, user.id);

  const { error, count } = await supabase
    .from("recipes")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete recipe: ${error.message}`);
  }

  return (count ?? 0) > 0;
}

export interface RecipeFilters {
  query?: string;
  category?: string;
  difficulty?: string;
}

export function filterRecipes(
  recipes: Recipe[],
  filters: RecipeFilters
): Recipe[] {
  const q = filters.query?.trim().toLowerCase();
  return recipes.filter((recipe) => {
    if (filters.category && recipe.category !== filters.category) {
      return false;
    }
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false;
    }
    if (!q) return true;

    const haystack = [
      recipe.title,
      recipe.author,
      recipe.category ?? "",
      recipe.cooking_time != null ? String(recipe.cooking_time) : "",
      ...recipe.ingredients,
      ...recipe.instructions,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
