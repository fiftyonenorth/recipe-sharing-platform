import type { ReactNode } from "react";
import { HeaderSkeleton } from "@/components/loading/header-skeleton";

interface PageShellProps {
  children: ReactNode;
  mainClassName?: string;
}

export function PageShell({ children, mainClassName = "" }: PageShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <span className="sr-only">Loading…</span>
      <HeaderSkeleton />
      <main
        className={`mx-auto w-full flex-1 px-4 py-10 sm:px-6 sm:py-14 ${mainClassName}`.trim()}
      >
        {children}
      </main>
    </div>
  );
}
