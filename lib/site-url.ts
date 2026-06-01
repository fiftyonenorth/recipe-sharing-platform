function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return false;
  }
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  if (isValidHttpUrl(fromEnv)) {
    return fromEnv;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

/** URLs to allow in Supabase → Authentication → Redirect URLs */
export function getAuthRedirectUrls(): string[] {
  const base = getSiteUrl();
  return [
    `${base}/auth/confirm`,
    `${base}/auth/recovery`,
    `${base}/reset-password`,
  ];
}

export function getPasswordResetRedirectUrl(): string {
  return `${getSiteUrl()}/auth/recovery`;
}
