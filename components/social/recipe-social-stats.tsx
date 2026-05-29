import type { RecipeSocialStats } from "@/lib/types";

interface RecipeSocialStatsProps {
  stats?: RecipeSocialStats;
  className?: string;
}

export function RecipeSocialStatsDisplay({
  stats,
  className = "",
}: RecipeSocialStatsProps) {
  if (!stats) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 ${className}`.trim()}
    >
      <span className="inline-flex items-center gap-1">
        <span aria-hidden>♥</span>
        <span>
          {stats.likeCount} {stats.likeCount === 1 ? "like" : "likes"}
        </span>
      </span>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1">
        <span aria-hidden>💬</span>
        <span>
          {stats.commentCount}{" "}
          {stats.commentCount === 1 ? "comment" : "comments"}
        </span>
      </span>
    </div>
  );
}
