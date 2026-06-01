import { getPasswordResetRedirectUrl } from "@/lib/site-url";

/** Redirect target for resetPasswordForEmail (server / build-time). */
export function getPasswordResetRedirectUrlForEmail(): string {
  return getPasswordResetRedirectUrl();
}

/**
 * Same as above, but uses the browser origin when available so preview
 * deployments always send the URL the user is actually on (not a stale build env).
 */
export function getPasswordResetRedirectUrlForEmailClient(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin.replace(/\/$/, "")}/auth/recovery`;
  }
  return getPasswordResetRedirectUrlForEmail();
}
