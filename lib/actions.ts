"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentUser } from "@/lib/auth";
import {
  removeRecipeImage,
  uploadRecipeImage,
} from "@/lib/recipe-images";
import {
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from "@/lib/recipes";
import type { Difficulty, RecipeCategory, RecipeInput } from "@/lib/types";

export interface ActionState {
  error?: string;
}

function parseRecipeForm(formData: FormData): RecipeInput | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "") as RecipeCategory;
  const difficulty = String(formData.get("difficulty") ?? "") as Difficulty;
  const cookingTimeRaw = String(formData.get("cookingTime") ?? "").trim();
  const cookingTime = cookingTimeRaw === "" ? NaN : Number(cookingTimeRaw);

  const ingredients = formData
    .getAll("ingredients")
    .map((v) => String(v).trim())
    .filter(Boolean);

  const instructions = formData
    .getAll("instructions")
    .map((v) => String(v).trim())
    .filter(Boolean);

  if (!title) {
    return { error: "Title is required." };
  }

  if (!ingredients.length || !instructions.length) {
    return {
      error: "Add at least one ingredient and one instruction step.",
    };
  }

  if (Number.isNaN(cookingTime) || cookingTime < 1) {
    return {
      error: "Cooking time is required (whole minutes, at least 1).",
    };
  }

  if (!Number.isInteger(cookingTime)) {
    return { error: "Cooking time must be a whole number of minutes." };
  }

  return {
    title,
    category: category || null,
    difficulty: difficulty || null,
    cooking_time: cookingTime,
    ingredients,
    instructions,
  };
}

function parseRecipeImageFromForm(formData: FormData) {
  const removeImage = formData.get("removeImage") === "true";
  const imageField = formData.get("image");
  const imageFile =
    imageField instanceof File && imageField.size > 0 ? imageField : null;

  return { removeImage, imageFile };
}

async function applyRecipeImageChanges(
  recipeId: string,
  userId: string,
  removeImage: boolean,
  imageFile: File | null
) {
  if (removeImage) {
    await removeRecipeImage(recipeId, userId);
  } else if (imageFile) {
    await uploadRecipeImage(recipeId, userId, imageFile);
  }
}

export async function createRecipeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to create a recipe." };
  }

  const parsed = parseRecipeForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { removeImage, imageFile } = parseRecipeImageFromForm(formData);

  try {
    const recipe = await createRecipe(parsed);
    await applyRecipeImageChanges(recipe.id, user.id, removeImage, imageFile);

    revalidatePath("/dashboard");
    redirect(`/recipes/${recipe.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error:
        error instanceof Error ? error.message : "Failed to create recipe.",
    };
  }
}

export async function updateRecipeAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to update a recipe." };
  }

  const parsed = parseRecipeForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { removeImage, imageFile } = parseRecipeImageFromForm(formData);

  try {
    await applyRecipeImageChanges(id, user.id, removeImage, imageFile);

    const recipe = await updateRecipe(id, parsed);
    if (!recipe) return { error: "Recipe not found." };

    revalidatePath("/dashboard");
    revalidatePath(`/recipes/${id}`);
    redirect(`/recipes/${recipe.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error:
        error instanceof Error ? error.message : "Failed to update recipe.",
    };
  }
}

export async function deleteRecipeAction(id: string): Promise<void> {
  await deleteRecipe(id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
