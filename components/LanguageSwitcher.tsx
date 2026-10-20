"use client";

import { useContent } from "@/lib/content";
import { LANGS, useLanguage, type Lang } from "@/lib/i18n";

const SHORT: Record<Lang, string> = {
  he: "עב",
  en: "EN",
  ar: "ع",
};


export function LanguageSwitcher() {
  const { labels, ui } = useContent();
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t(labels.language)}
      className="inline-flex items-center gap-0.5 rounded-full border border-border bg-bg-card/60 p-0.5"
    >
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-label={ui.langName[l]}
            aria-pressed={active}
            className={`min-w-8 rounded-full px-2.5 py-1 text-sm font-semibold transition-colors ${
              active
                ? "bg-accent text-[#1a1306]"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            {SHORT[l]}
          </button>
        );
      })}
    </div>
  );
}
