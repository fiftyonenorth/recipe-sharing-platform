import type { ReactNode } from "react";

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50";

const labelClass =
  "text-xs font-medium uppercase tracking-wide text-stone-500";

interface AuthFieldProps {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}

export function AuthField({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required,
  placeholder,
}: AuthFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

export function AuthAlert({
  variant,
  children,
}: {
  variant: "error" | "success";
  children: ReactNode;
}) {
  const styles =
    variant === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
      : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200";

  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      {children}
    </p>
  );
}
