import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Header } from "@/components/header";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Reset password — RecipeShare",
  description: "Request a link to reset your RecipeShare password.",
};

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <AuthCard
          title="Reset your password"
          description="Enter your email and we'll send you a link to choose a new password."
          footer={
            <>
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400"
              >
                Sign in
              </Link>
            </>
          }
        >
          <ForgotPasswordForm />
        </AuthCard>
      </main>
    </div>
  );
}
