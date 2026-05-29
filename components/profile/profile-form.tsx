"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { AuthAlert } from "@/components/auth/auth-field";
import { AvatarUploadField } from "@/components/profile/avatar-upload-field";
import type { Profile } from "@/lib/auth";
import { updateProfileAction } from "@/lib/actions/profile";

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50";

const labelClass =
  "text-xs font-medium uppercase tracking-wide text-stone-500";

interface ProfileFormProps {
  profile: Profile;
  email: string;
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    {}
  );

  const displayName =
    profile.full_name?.trim() || profile.username || "You";

  const avatarUrl =
    state.avatarUrl !== undefined ? state.avatarUrl : profile.avatar_url;

  useEffect(() => {
    if (state.message) {
      router.refresh();
    }
  }, [state.message, router]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error && <AuthAlert variant="error">{state.error}</AuthAlert>}
      {state.message && (
        <AuthAlert variant="success">{state.message}</AuthAlert>
      )}

      <AvatarUploadField
        displayName={displayName}
        avatarUrl={avatarUrl}
      />

      <label htmlFor="email" className="flex flex-col gap-1.5">
        <span className={labelClass}>Email</span>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          readOnly
          className={`${inputClass} cursor-not-allowed opacity-70`}
        />
        <span className="text-xs text-stone-500">Cannot be changed here.</span>
      </label>

      <label htmlFor="username" className="flex flex-col gap-1.5">
        <span className={labelClass}>Username</span>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          defaultValue={profile.username}
          className={inputClass}
          pattern="[a-z0-9_]{3,30}"
          title="3–30 characters: lowercase letters, numbers, and underscores"
        />
        <span className="text-xs text-stone-500">
          Shown on your recipes. Lowercase letters, numbers, and underscores
          only.
        </span>
      </label>

      <label htmlFor="fullName" className="flex flex-col gap-1.5">
        <span className={labelClass}>Full name</span>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          defaultValue={profile.full_name ?? ""}
          placeholder="Jane Cook"
          className={inputClass}
          maxLength={100}
        />
      </label>

      <label htmlFor="bio" className="flex flex-col gap-1.5">
        <span className={labelClass}>Bio</span>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={profile.bio ?? ""}
          placeholder="Tell the community about your cooking style, favorite cuisines, or kitchen tips…"
          className={`${inputClass} resize-y`}
          maxLength={500}
        />
        <span className="text-xs text-stone-500">Up to 500 characters.</span>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-colors hover:bg-amber-600 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
