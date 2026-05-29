"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from "@/lib/recipes";
import type { Difficulty, RecipeCategory, RecipeInput } from "@/lib/types";

export interface RecipeFormState {
  errors?: Record<string, string>;
  message?: string;
}

function parseRecipeForm(formData: FormData): RecipeInput | null {
  const title = (formData.get("title") as string)?.trim();
  const category = formData.get("category") as RecipeCategory;
  const difficulty = formData.get("difficulty") as Difficulty;
  const cookingTimeRaw = formData.get("cookingTime");
  const cookingTime =
    cookingTimeRaw === null || cookingTimeRaw === ""
      ? null
      : Number(cookingTimeRaw);

  const ingredients = (formData.get("ingredients") as string)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const instructions = (formData.get("instructions") as string)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!title) return null;
  if (!ingredients.length || !instructions.length) return null;

  return {
    title,
    category: category || null,
    difficulty: difficulty || null,
    cooking_time: cookingTime,
    ingredients,
    instructions,
  };
}

function validate(input: RecipeInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.title) errors.title = "Title is required";
  if (!input.ingredients.length)
    errors.ingredients = "Add at least one ingredient";
  if (!input.instructions.length)
    errors.instructions = "Add at least one instruction step";
  if (
    input.cooking_time != null &&
    (Number.isNaN(input.cooking_time) || input.cooking_time < 0)
  ) {
    errors.cookingTime = "Cooking time must be zero or greater";
  }
  return errors;
}

export async function createRecipeAction(
  _prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const input = parseRecipeForm(formData);
  if (!input) {
    return { errors: { form: "Please fill in all required fields" } };
  }

  const errors = validate(input);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const recipe = await createRecipe(input);
    revalidatePath("/");
    redirect(`/recipes/${recipe.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      message:
        error instanceof Error ? error.message : "Failed to create recipe.",
    };
  }
}

export async function updateRecipeAction(
  id: string,
  _prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const input = parseRecipeForm(formData);
  if (!input) {
    return { errors: { form: "Please fill in all required fields" } };
  }

  const errors = validate(input);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const recipe = await updateRecipe(id, input);
    if (!recipe) {
      return { message: "Recipe not found" };
    }

    revalidatePath("/");
    revalidatePath(`/recipes/${id}`);
    redirect(`/recipes/${recipe.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      message:
        error instanceof Error ? error.message : "Failed to update recipe.",
    };
  }
}

export async function deleteRecipeAction(id: string): Promise<void> {
  await deleteRecipe(id);
  revalidatePath("/");
  redirect("/");
}
