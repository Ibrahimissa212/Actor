"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, toggle } = useLanguage();
  // Show the language you can switch TO.
  const target = lang === "he" ? "English" : "עברית";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch language"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-card/60 px-3 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg"
    >
      <Languages className="h-4 w-4" aria-hidden />
      <span>{target}</span>
    </button>
  );
}
