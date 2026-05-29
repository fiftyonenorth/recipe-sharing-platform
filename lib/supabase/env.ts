/**
 * Project URL only — not the PostgREST path.
 * Correct:   https://YOUR_REF.supabase.co
 * Incorrect: https://YOUR_REF.supabase.co/rest/v1
 */
export function getSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!raw) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  }

  try {
    const url = new URL(raw);
    url.pathname = url.pathname.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "") || "";
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch {
    return raw.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
  }
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  }

  return key;
}
