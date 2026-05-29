import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Header } from "@/components/header";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Create account — RecipeShare",
  description: "Join RecipeShare and start sharing your recipes.",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <AuthCard
          title="Join RecipeShare"
          description="Create an account to publish recipes and join the community."
          footer={
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400"
              >
                Sign in
              </Link>
            </>
          }
        >
          <SignUpForm />
        </AuthCard>
      </main>
    </div>
  );
}
