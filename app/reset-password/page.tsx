import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Header } from "@/components/header";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Choose a new password — RecipeShare",
  description: "Set a new password for your RecipeShare account.",
};

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        {user ? (
          <AuthCard
            title="Choose a new password"
            description="Enter and confirm your new password below."
            footer={
              <>
                <Link
                  href="/login"
                  className="font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400"
                >
                  Back to sign in
                </Link>
              </>
            }
          >
            <ResetPasswordForm />
          </AuthCard>
        ) : (
          <div className="mx-auto w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
              Link expired
            </h1>
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
              Open the reset link from your email, or request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="mt-6 inline-flex rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Request reset email
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
