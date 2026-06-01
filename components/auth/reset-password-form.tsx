"use client";

import { useActionState } from "react";
import { resetPasswordAction, type AuthFormState } from "@/lib/actions/auth";
import { AuthAlert, AuthField } from "@/components/auth/auth-field";

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    resetPasswordAction,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <AuthAlert variant="error">{state.error}</AuthAlert>}

      <AuthField
        id="password"
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        placeholder="At least 6 characters"
      />
      <AuthField
        id="confirmPassword"
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        placeholder="Repeat your password"
      />

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-full bg-amber-500 py-3 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600 disabled:opacity-60"
      >
        {isPending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
