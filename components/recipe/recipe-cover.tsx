interface RecipeCoverProps {
  imageUrl?: string | null;
  title: string;
  className?: string;
}

export function RecipeCover({
  imageUrl,
  title,
  className = "aspect-[4/3] w-full",
}: RecipeCoverProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={title}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-5xl ${className}`}
      aria-hidden
    >
      🍽️
    </div>
  );
}
