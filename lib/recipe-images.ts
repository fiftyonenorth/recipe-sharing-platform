import { createClient } from "@/lib/supabase/server";

const RECIPE_IMAGE_BUCKET = "recipe-images";
const MAX_RECIPE_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function recipeImagePath(
  userId: string,
  recipeId: string,
  mimeType: string
): string {
  const ext = EXTENSION_BY_MIME[mimeType];
  if (!ext) {
    throw new Error("Unsupported image type.");
  }
  return `${userId}/${recipeId}/cover.${ext}`;
}

export function validateRecipeImageFile(file: File): string | null {
  if (!file.size) {
    return null;
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return "Use a JPEG, PNG, WebP, or GIF image.";
  }

  if (file.size > MAX_RECIPE_IMAGE_BYTES) {
    return "Image must be 5 MB or smaller.";
  }

  return null;
}

async function assertRecipeOwner(recipeId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("user_id")
    .eq("id", recipeId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to verify recipe: ${error.message}`);
  }

  if (!data || data.user_id !== userId) {
    throw new Error("You can only update images for your own recipes.");
  }
}

export async function uploadRecipeImage(
  recipeId: string,
  userId: string,
  file: File
): Promise<string> {
  const validationError = validateRecipeImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  await assertRecipeOwner(recipeId, userId);

  const supabase = await createClient();
  const path = recipeImagePath(userId, recipeId, file.type);
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(RECIPE_IMAGE_BUCKET)
    .upload(path, bytes, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes("bucket not found")) {
      throw new Error(
        "Recipe image storage is not set up yet. Run supabase/migrations/20250520120000_recipe_images_storage.sql in the Supabase SQL Editor."
      );
    }
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(RECIPE_IMAGE_BUCKET).getPublicUrl(path);

  const versionedUrl = `${publicUrl.split("?")[0]}?v=${Date.now()}`;

  const { error: recipeError } = await supabase
    .from("recipes")
    .update({ image_url: versionedUrl })
    .eq("id", recipeId)
    .eq("user_id", userId);

  if (recipeError) {
    throw new Error(`Failed to save recipe image: ${recipeError.message}`);
  }

  return versionedUrl;
}

export async function removeRecipeImage(
  recipeId: string,
  userId: string
): Promise<void> {
  await assertRecipeOwner(recipeId, userId);

  const supabase = await createClient();
  const folder = `${userId}/${recipeId}`;

  const { data: files, error: listError } = await supabase.storage
    .from(RECIPE_IMAGE_BUCKET)
    .list(folder);

  if (listError) {
    throw new Error(`Failed to remove image: ${listError.message}`);
  }

  if (files?.length) {
    const paths = files.map((file) => `${folder}/${file.name}`);
    const { error: removeError } = await supabase.storage
      .from(RECIPE_IMAGE_BUCKET)
      .remove(paths);

    if (removeError) {
      throw new Error(`Failed to remove image: ${removeError.message}`);
    }
  }

  const { error: recipeError } = await supabase
    .from("recipes")
    .update({ image_url: null })
    .eq("id", recipeId)
    .eq("user_id", userId);

  if (recipeError) {
    throw new Error(`Failed to update recipe: ${recipeError.message}`);
  }
}

export async function deleteRecipeImages(
  recipeId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();
  const folder = `${userId}/${recipeId}`;

  const { data: files } = await supabase.storage
    .from(RECIPE_IMAGE_BUCKET)
    .list(folder);

  if (files?.length) {
    const paths = files.map((file) => `${folder}/${file.name}`);
    await supabase.storage.from(RECIPE_IMAGE_BUCKET).remove(paths);
  }
}
