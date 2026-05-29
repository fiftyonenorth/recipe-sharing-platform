import type { ComponentProps } from "react";

interface SkeletonProps extends ComponentProps<"div"> {}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-stone-200 dark:bg-stone-800 ${className}`.trim()}
      aria-hidden
      {...props}
    />
  );
}
