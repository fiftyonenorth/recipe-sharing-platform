import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/auth";

export interface ProfileUpdateInput {
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url?: string | null;
}

const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;

export function validateUsername(username: string): string | null {
  const normalized = username.trim().toLowerCase();
  if (!normalized) {
    return "Username is required.";
  }
  if (!USERNAME_PATTERN.test(normalized)) {
    return "Username must be 3–30 characters: lowercase letters, numbers, and underscores only.";
  }
  return null;
}

export async function updateProfile(
  userId: string,
  input: ProfileUpdateInput
): Promise<Profile> {
  const usernameError = validateUsername(input.username);
  if (usernameError) {
    throw new Error(usernameError);
  }

  const bio = input.bio?.trim() || null;
  if (bio && bio.length > 500) {
    throw new Error("Bio must be 500 characters or fewer.");
  }

  const fullName = input.full_name?.trim() || null;
  if (fullName && fullName.length > 100) {
    throw new Error("Full name must be 100 characters or fewer.");
  }

  const supabase = await createClient();
  const updates: {
    username: string;
    full_name: string | null;
    bio: string | null;
    avatar_url?: string | null;
  } = {
    username: input.username.trim().toLowerCase(),
    full_name: fullName,
    bio,
  };

  if (input.avatar_url !== undefined) {
    updates.avatar_url = input.avatar_url;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("That username is already taken. Try another.");
    }
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data;
}
