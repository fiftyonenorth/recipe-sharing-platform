import { formatMinutes } from "@/lib/utils";

interface CookingTimeBadgeProps {
  minutes: number;
  className?: string;
}

export function CookingTimeBadge({ minutes, className = "" }: CookingTimeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-stone-700 backdrop-blur-sm dark:bg-stone-900/90 dark:text-stone-200 ${className}`}
    >
      <span aria-hidden>⏱</span>
      {formatMinutes(minutes)}
    </span>
  );
}
