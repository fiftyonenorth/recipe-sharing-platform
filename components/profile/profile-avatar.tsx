"use client";

import { useEffect, useState } from "react";

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-20 w-20 text-2xl",
  lg: "h-28 w-28 text-3xl",
} as const;

interface ProfileAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: keyof typeof sizeClasses;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase();
}

export function ProfileAvatar({
  name,
  avatarUrl,
  size = "md",
  className = "",
}: ProfileAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const sizeClass = sizeClasses[size];

  useEffect(() => {
    setHasImageError(false);
  }, [avatarUrl]);

  if (avatarUrl && !hasImageError) {
    return (
      <img
        src={avatarUrl}
        alt=""
        width={size === "sm" ? 32 : size === "md" ? 80 : 112}
        height={size === "sm" ? 32 : size === "md" ? 80 : 112}
        className={`rounded-full object-cover ${sizeClass} ${className}`}
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200 ${sizeClass} ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}
