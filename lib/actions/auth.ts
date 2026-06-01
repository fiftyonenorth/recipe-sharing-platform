"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

export interface AuthFormState {
  error?: string;
  message?: string;
}

function authErrorMessage(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (lower.includes("user already registered")) {
    return "An account with this email already exists. Try signing in.";
  }

  if (lower.includes("password")) {
    return "Password must be at least 6 characters.";
  }

  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return message;
}

function getPasswordResetRedirectUrl(): string {
  return `${getSiteUrl()}/auth/recovery`;
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim() || "/dashboard";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: authErrorMessage(error.message) };
    }

    revalidatePath("/", "layout");
    redirect(next.startsWith("/") ? next : "/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error:
        error instanceof Error ? error.message : "Could not sign in. Try again.",
    };
  }
}

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined,
        emailRedirectTo: `${getSiteUrl()}/auth/confirm?next=/dashboard`,
      },
    });

    if (error) {
      return { error: authErrorMessage(error.message) };
    }

    revalidatePath("/", "layout");

    if (data.session) {
      redirect("/dashboard");
    }

    return {
      message:
        "Check your email for a confirmation link before signing in.",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not create account. Try again.",
    };
  }
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordResetAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Email is required." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordResetRedirectUrl(),
    });

    if (error) {
      return { error: authErrorMessage(error.message) };
    }

    return {
      message:
        "If an account exists for that email, we've sent a link to reset your password.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not send reset email. Try again.",
    };
  }
}

export async function resetPasswordAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!password || !confirmPassword) {
    return { error: "Both password fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error:
          "Your reset link has expired or is invalid. Request a new password reset email.",
      };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: authErrorMessage(error.message) };
    }

    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login?reset=success");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not update password. Try again.",
    };
  }
}
