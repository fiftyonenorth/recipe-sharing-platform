import Link from "next/link";
import { Header } from "@/components/header";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileNavLinks } from "@/components/profile/profile-nav-links";
import { getCurrentProfile, requireUser } from "@/lib/auth";

export const metadata = {
  title: "Your profile — RecipeShare",
  description: "Update your name, username, and bio.",
};

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
        <Header />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
            We couldn&apos;t load your profile. Try signing out and back in.
          </p>
        </main>
      </div>
    );
  }

  const memberSince = new Date(profile.created_at).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 dark:hover:text-stone-50"
        >
          <span aria-hidden>←</span> Back to dashboard
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Your profile
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Member since {memberSince}. This info appears on recipes you share.
        </p>

        <ProfileNavLinks />

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 dark:border-stone-800 dark:bg-stone-900">
          <ProfileForm
            key={`${profile.updated_at}-${profile.avatar_url ?? ""}`}
            profile={profile}
            email={user.email ?? ""}
          />
        </div>
      </main>
    </div>
  );
}
