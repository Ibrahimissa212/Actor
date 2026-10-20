"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "he" | "en" | "ar";

export const LANGS: Lang[] = ["he", "en", "ar"];
export const DEFAULT_LANG: Lang = "he";

export function dirFor(lang: Lang): "rtl" | "ltr" {
  return lang === "en" ? "ltr" : "rtl";
}

/**
 * Multilingual string helper. `he` and `en` are required; `ar` is optional
 * and falls back to Hebrew (both are RTL) when not provided.
 */
export type Bi = { he: string; en: string; ar?: string };

type LanguageContextValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** Resolve a bilingual value for the active language. */
  t: (value: Bi) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "portfolio.lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Restore persisted choice on mount.
  useEffect(() => {
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(STORAGE_KEY); } catch {}
    if (stored === "he" || stored === "en" || stored === "ar") {
      // Restore a browser preference after matching the server-rendered language.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(stored);
    }
  }, []);

  // Keep <html lang/dir> and persistence in sync with the active language.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dirFor(lang);
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(
    () =>
      setLangState((prev) => {
        const idx = LANGS.indexOf(prev);
        return LANGS[(idx + 1) % LANGS.length];
      }),
    [],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: dirFor(lang),
      setLang,
      toggle,
      // Arabic falls back to Hebrew when a string hasn't been translated.
      t: (v: Bi) => lang === "ar" ? (v.ar || v.he) : v[lang],
    }),
    [lang, setLang, toggle],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
