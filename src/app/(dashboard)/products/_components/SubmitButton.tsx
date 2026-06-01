"use client";

import { useFormStatus } from "react-dom";

function Spinner() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "accent",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "accent" | "danger";
}) {
  const { pending } = useFormStatus();

  const tone =
    variant === "danger"
      ? "bg-danger text-on-accent hover:brightness-110 focus-visible:ring-danger/40"
      : "bg-accent text-on-accent hover:bg-accent-hover focus-visible:ring-ring";

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-[background-color,filter,opacity] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-65 ${tone}`}
    >
      {pending && <Spinner />}
      {pending ? pendingLabel : children}
    </button>
  );
}
