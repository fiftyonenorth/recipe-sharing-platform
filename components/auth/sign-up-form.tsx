"use client";

import { useActionState } from "react";
import { signUpAction, type AuthFormState } from "@/lib/actions/auth";
import { AuthAlert, AuthField } from "@/components/auth/auth-field";

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    signUpAction,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <AuthAlert variant="error">{state.error}</AuthAlert>}
      {state.message && <AuthAlert variant="success">{state.message}</AuthAlert>}

      <AuthField
        id="fullName"
        label="Full name (optional)"
        name="fullName"
        autoComplete="name"
        placeholder="Alex Cook"
      />
      <AuthField
        id="email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
      />
      <AuthField
        id="password"
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        placeholder="At least 6 characters"
      />

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-full bg-amber-500 py-3 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600 disabled:opacity-60"
      >
        {isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
