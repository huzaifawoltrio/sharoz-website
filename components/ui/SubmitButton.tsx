"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

const VARIANT_CLASSES = {
  // Fixed neutral styling — used everywhere in the admin portal so the
  // editing UI never changes look based on the customer's public-site
  // theme.
  neutral:
    "inline-flex items-center gap-2 rounded bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50",
  // Follows the active public-site color theme — used on public forms
  // (contact, checkout).
  accent:
    "inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50",
};

export default function SubmitButton({
  children,
  className,
  variant = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof VARIANT_CLASSES;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className ?? VARIANT_CLASSES[variant]}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
