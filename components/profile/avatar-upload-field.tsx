"use client";

import { useEffect, useRef, useState } from "react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";

const labelClass =
  "text-xs font-medium uppercase tracking-wide text-stone-500";

interface AvatarUploadFieldProps {
  displayName: string;
  avatarUrl?: string | null;
}

export function AvatarUploadField({
  displayName,
  avatarUrl,
}: AvatarUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setRemovePhoto(false);
  }, [avatarUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setRemovePhoto(false);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  }

  function handleRemove() {
    setRemovePhoto(true);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const shownUrl = removePhoto ? null : previewUrl ?? avatarUrl;

  return (
    <div className="flex flex-col gap-3">
      <span className={labelClass}>Profile photo</span>
      <div className="flex flex-wrap items-center gap-5">
        <ProfileAvatar
          key={shownUrl ?? "initials"}
          name={displayName}
          avatarUrl={shownUrl}
          size="lg"
        />
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            id="avatar"
            name="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleFileChange}
          />
          <label
            htmlFor="avatar"
            className="inline-flex cursor-pointer rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
          >
            Choose image
          </label>
          {(avatarUrl || previewUrl) && !removePhoto && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-left text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              Remove photo
            </button>
          )}
          <p className="text-xs text-stone-500">
            JPEG, PNG, WebP, or GIF. Max 2 MB.
          </p>
        </div>
      </div>
      <input
        type="hidden"
        name="removeAvatar"
        value={removePhoto ? "true" : "false"}
      />
    </div>
  );
}
