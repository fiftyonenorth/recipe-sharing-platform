"use client";

import { useEffect, useRef, useState } from "react";

const labelClass =
  "text-xs font-medium uppercase tracking-wide text-stone-500";

interface RecipeImageUploadFieldProps {
  imageUrl?: string | null;
  title?: string;
}

export function RecipeImageUploadField({
  imageUrl,
  title = "Recipe",
}: RecipeImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

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
    setRemoveImage(false);
  }, [imageUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setRemoveImage(false);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  }

  function handleRemove() {
    setRemoveImage(true);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const shownUrl = removeImage ? null : previewUrl ?? imageUrl;

  return (
    <div className="flex flex-col gap-3">
      <span className={labelClass}>Cover photo</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-stone-200 bg-gradient-to-br from-amber-100 to-orange-100 sm:max-w-xs dark:border-stone-700 ${
            shownUrl ? "" : "flex items-center justify-center text-5xl"
          }`}
        >
          {shownUrl ? (
            <img
              src={shownUrl}
              alt={`${title} cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden>🍽️</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            id="recipeImage"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleFileChange}
          />
          <label
            htmlFor="recipeImage"
            className="inline-flex cursor-pointer rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
          >
            Choose image
          </label>
          {(imageUrl || previewUrl) && !removeImage && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-left text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              Remove photo
            </button>
          )}
          <p className="text-xs text-stone-500">
            JPEG, PNG, WebP, or GIF. Max 5 MB. Optional.
          </p>
        </div>
      </div>
      <input
        type="hidden"
        name="removeImage"
        value={removeImage ? "true" : "false"}
      />
    </div>
  );
}
