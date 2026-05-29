"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { removeProfileAvatar, uploadProfileAvatar } from "@/lib/avatars";
import { getCurrentUser } from "@/lib/auth";
import { updateProfile } from "@/lib/profiles";

export interface ProfileFormState {
  error?: string;
  message?: string;
  avatarUrl?: string | null;
}

function revalidateProfilePaths() {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/profile");
}

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to update your profile." };
  }

  const username = String(formData.get("username") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const removeAvatar = formData.get("removeAvatar") === "true";
  const avatarField = formData.get("avatar");
  const avatarFile =
    avatarField instanceof File && avatarField.size > 0 ? avatarField : null;

  try {
    let avatarUrl: string | null | undefined;

    if (removeAvatar) {
      await removeProfileAvatar(user.id);
      avatarUrl = null;
    } else if (avatarFile) {
      avatarUrl = await uploadProfileAvatar(user.id, avatarFile);
    }

    const updatedProfile = await updateProfile(user.id, {
      username,
      full_name: fullName || null,
      bio: bio || null,
    });

    revalidateProfilePaths();

    return {
      message: "Profile saved.",
      avatarUrl: avatarUrl !== undefined ? avatarUrl : updatedProfile.avatar_url,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error:
        error instanceof Error ? error.message : "Failed to update profile.",
    };
  }
}
