"use client";

import { useState, type FormEvent } from "react";
import { AuthAlert, AuthField } from "@/components/auth/auth-field";
import { createClient } from "@/lib/supabase/client";
import { getPasswordResetRedirectUrlForEmailClient } from "@/lib/password-reset-url";

function authErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return message;
}

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setError("Email is required.");
      setIsPending(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: getPasswordResetRedirectUrlForEmailClient() }
      );

      if (resetError) {
        setError(authErrorMessage(resetError.message));
        return;
      }

      setMessage(
        "If an account exists for that email, we've sent a link to reset your password. Open the link in this same browser if you can."
      );
    } catch {
      setError("Could not send reset email. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <AuthAlert variant="error">{error}</AuthAlert>}
      {message && <AuthAlert variant="success">{message}</AuthAlert>}

      <AuthField
        id="email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
      />

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-full bg-amber-500 py-3 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600 disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
