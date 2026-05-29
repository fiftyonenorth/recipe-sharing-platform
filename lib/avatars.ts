import { createClient } from "@/lib/supabase/server";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

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

function avatarObjectPath(userId: string, mimeType: string): string {
  const ext = EXTENSION_BY_MIME[mimeType];
  if (!ext) {
    throw new Error("Unsupported image type.");
  }
  return `${userId}/avatar.${ext}`;
}

export function validateAvatarFile(file: File): string | null {
  if (!file.size) {
    return null;
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return "Use a JPEG, PNG, WebP, or GIF image.";
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return "Image must be 2 MB or smaller.";
  }

  return null;
}

export async function uploadProfileAvatar(
  userId: string,
  file: File
): Promise<string> {
  const validationError = validateAvatarFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const supabase = await createClient();
  const path = avatarObjectPath(userId, file.type);
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, bytes, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes("bucket not found")) {
      throw new Error(
        "Photo storage is not set up yet. In the Supabase dashboard, open SQL Editor and run the script supabase/migrations/20250519130000_profile_avatars_storage.sql (or create a public bucket named \"avatars\" under Storage)."
      );
    }
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  const baseUrl = publicUrl.split("?")[0];
  const versionedUrl = `${baseUrl}?v=${Date.now()}`;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: versionedUrl })
    .eq("id", userId);

  if (profileError) {
    throw new Error(`Failed to save profile photo: ${profileError.message}`);
  }

  return versionedUrl;
}

export async function removeProfileAvatar(userId: string): Promise<void> {
  const supabase = await createClient();

  const { data: files, error: listError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId);

  if (listError) {
    throw new Error(`Failed to remove image: ${listError.message}`);
  }

  if (files?.length) {
    const paths = files.map((file) => `${userId}/${file.name}`);
    const { error: removeError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .remove(paths);

    if (removeError) {
      throw new Error(`Failed to remove image: ${removeError.message}`);
    }
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", userId);

  if (profileError) {
    throw new Error(`Failed to update profile: ${profileError.message}`);
  }
}
