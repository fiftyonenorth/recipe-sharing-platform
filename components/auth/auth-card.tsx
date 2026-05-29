import Link from "next/link";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 dark:hover:text-stone-50"
        >
          <span aria-hidden>←</span> Back to home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          {title}
        </h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          {description}
        </p>
        <div className="mt-8">{children}</div>
      </div>
      <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
        {footer}
      </p>
    </div>
  );
}
