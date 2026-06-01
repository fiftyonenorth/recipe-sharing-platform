"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, type AuthFormState } from "@/lib/actions/auth";
import { AuthAlert, AuthField } from "@/components/auth/auth-field";

interface LoginFormProps {
  next?: string;
  resetSuccess?: boolean;
}

export function LoginForm({ next, resetSuccess }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    signInAction,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}

      {resetSuccess && (
        <AuthAlert variant="success">
          Your password has been updated. Sign in with your new password.
        </AuthAlert>
      )}
      {state.error && <AuthAlert variant="error">{state.error}</AuthAlert>}
      {state.message && <AuthAlert variant="success">{state.message}</AuthAlert>}

      <AuthField
        id="email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
      />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Password
          </span>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Your password"
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-full bg-amber-500 py-3 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600 disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
