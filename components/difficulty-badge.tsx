import { DIFFICULTY_LABELS } from "@/lib/utils";
import type { Difficulty } from "@/lib/types";

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  hard: "text-rose-600 dark:text-rose-400",
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`text-xs font-medium ${DIFFICULTY_STYLES[difficulty]}`}>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}
