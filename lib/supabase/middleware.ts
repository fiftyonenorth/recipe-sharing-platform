import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

function getAuthCallbackRedirect(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  const hasAuthParams = Boolean(code || (token_hash && type));
  if (!hasAuthParams || pathname.startsWith("/auth/")) {
    return null;
  }

  const url = request.nextUrl.clone();

  if (type === "recovery" || next === "/reset-password") {
    url.pathname = "/auth/recovery";
    return NextResponse.redirect(url);
  }

  if (next?.startsWith("/")) {
    url.pathname = "/auth/confirm";
    return NextResponse.redirect(url);
  }

  // Supabase often strips redirect_to to Site URL only (e.g. /?code=...)
  if (pathname === "/") {
    url.pathname = "/auth/recovery";
    return NextResponse.redirect(url);
  }

  url.pathname = "/auth/confirm";
  return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
  const authRedirect = getAuthCallbackRedirect(request);
  if (authRedirect) {
    return authRedirect;
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  await supabase.auth.getClaims();

  return supabaseResponse;
}
