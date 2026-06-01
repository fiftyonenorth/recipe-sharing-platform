import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import {
  createRouteHandlerClient,
  getAuthCallbackRedirectUrl,
} from "@/lib/supabase/route-handler";

interface HandleAuthCallbackOptions {
  request: NextRequest;
  successPath: string;
}

export async function handleAuthCallback({
  request,
  successPath,
}: HandleAuthCallbackOptions): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const successUrl = getAuthCallbackRedirectUrl(request, successPath);
  const errorUrl = new URL("/auth/auth-code-error", request.url);

  if (code) {
    const response = NextResponse.redirect(successUrl);
    const supabase = createRouteHandlerClient(request, response);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      errorUrl.searchParams.set("error", error.message);
      return NextResponse.redirect(errorUrl);
    }

    return response;
  }

  if (token_hash && type) {
    const response = NextResponse.redirect(successUrl);
    const supabase = createRouteHandlerClient(request, response);
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      errorUrl.searchParams.set("error", error.message);
      return NextResponse.redirect(errorUrl);
    }

    return response;
  }

  return NextResponse.redirect(errorUrl);
}
