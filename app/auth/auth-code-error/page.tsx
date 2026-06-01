import Link from "next/link";
import { Header } from "@/components/header";

export const metadata = {
  title: "Authentication error — RecipeShare",
};

interface AuthCodeErrorPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AuthCodeErrorPage({
  searchParams,
}: AuthCodeErrorPageProps) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />
      <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
          Link could not be verified
        </h1>
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
          The link may have expired or already been used.
          {error ? ` (${error})` : null}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/forgot-password"
            className="rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Reset password
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-100 dark:hover:bg-stone-800"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-100 dark:hover:bg-stone-800"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
