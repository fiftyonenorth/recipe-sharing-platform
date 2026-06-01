"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

interface ResetPasswordSessionProps {
  children: ReactNode;
  fallback: ReactNode;
}

export function ResetPasswordSession({
  children,
  fallback,
}: ResetPasswordSessionProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    async function establishSession() {
      const supabase = createClient();
      const hash = window.location.hash.replace(/^#/, "");

      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (accessToken && refreshToken && type === "recovery") {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            window.history.replaceState(null, "", window.location.pathname);
            router.refresh();
            if (!cancelled) setStatus("ready");
            return;
          }
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!cancelled) {
        setStatus(user ? "ready" : "missing");
      }
    }

    void establishSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Verifying your reset link…
        </p>
      </div>
    );
  }

  if (status === "missing") {
    return fallback;
  }

  return children;
}
