import Link from "next/link";

const linkClass =
  "flex flex-1 flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-colors hover:border-amber-200 hover:bg-amber-50/50 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-800/50 dark:hover:bg-amber-950/20";

export function ProfileNavLinks() {
  return (
    <nav
      className="mb-8 grid gap-4 sm:grid-cols-2"
      aria-label="Profile sections"
    >
      <Link href="/saved" className={linkClass}>
        <span className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          Saved recipes
        </span>
        <span className="text-sm text-stone-600 dark:text-stone-400">
          Recipes you&apos;ve liked
        </span>
      </Link>
      <Link href="/dashboard" className={linkClass}>
        <span className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          Dashboard
        </span>
        <span className="text-sm text-stone-600 dark:text-stone-400">
          Your recipes and community picks
        </span>
      </Link>
    </nav>
  );
}
