"use client";

import { useLanguage } from "@/lib/i18n";
import { profile } from "@/content/site";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-6 py-8 text-center text-sm text-fg-muted">
      <p>
        © {year} {t(profile.name)}
      </p>
    </footer>
  );
}
