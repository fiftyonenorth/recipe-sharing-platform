import { type NextRequest } from "next/server";
import { handleAuthCallback } from "@/lib/supabase/auth-callback";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  let successPath = "/";

  if (type === "recovery" || next === "/reset-password") {
    successPath = "/reset-password";
  } else if (next?.startsWith("/")) {
    successPath = next;
  }

  return handleAuthCallback({ request, successPath });
}
