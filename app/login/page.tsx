import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/header";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Sign in — RecipeShare",
  description: "Sign in to share and manage your recipes.",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  const { next } = await searchParams;

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <AuthCard
          title="Welcome back"
          description="Sign in to share recipes and manage your kitchen."
          footer={
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400"
              >
                Create one
              </Link>
            </>
          }
        >
          <LoginForm next={next} />
        </AuthCard>
      </main>
    </div>
  );
}
