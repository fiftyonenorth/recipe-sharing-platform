import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";

export async function Header() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  const displayName =
    profile?.full_name?.trim() || profile?.username || user?.email;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={user ? "/dashboard" : "/"}
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-lg shadow-sm shadow-amber-500/30 transition-transform group-hover:scale-105">
            🍳
          </span>
          <span className="font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            RecipeShare
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:inline dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
              >
                Dashboard
              </Link>
              <Link
                href="/search"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:inline dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
              >
                Search
              </Link>
              <Link
                href="/saved"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:inline dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
              >
                Saved
              </Link>
              <Link
                href="/profile"
                className="hidden max-w-[180px] items-center gap-2 truncate rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:inline-flex dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
                title="Edit your profile"
              >
                <ProfileAvatar
                  name={displayName ?? "User"}
                  avatarUrl={profile?.avatar_url}
                  size="sm"
                />
                <span className="truncate">{displayName}</span>
              </Link>
              <Link
                href="/recipes/new"
                className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600"
              >
                Share a recipe
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:inline dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:inline dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
              >
                Search
              </Link>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
