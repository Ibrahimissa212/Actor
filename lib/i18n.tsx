"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "he" | "en";

export const LANGS: Lang[] = ["he", "en"];
export const DEFAULT_LANG: Lang = "he";

export function dirFor(lang: Lang): "rtl" | "ltr" {
  return lang === "he" ? "rtl" : "ltr";
}

/** Bilingual string helper: pick the value for the active language. */
export type Bi = Record<Lang, string>;

/** UI chrome strings (navigation, buttons, labels). */
export const ui = {
  nav: {
    about: { he: "אודות", en: "About" },
    showreel: { he: "סרטון תקציר", en: "Showreel" },
    video: { he: "וידאו", en: "Video" },
    photos: { he: "תמונות", en: "Photos" },
    contact: { he: "צור קשר", en: "Contact" },
  },
  hero: {
    scroll: { he: "גלול למטה", en: "Scroll down" },
  },
  video: {
    professional: { he: "צילומים מקצועיים", en: "Professional Shoot" },
    course: {
      he: "קטעים מהקורס — במה ומצלמה",
      en: "From the Course — Stage & Camera",
    },
    play: { he: "נגן", en: "Play" },
    close: { he: "סגור", en: "Close" },
  },
  photos: {
    title: { he: "צילומים מקצועיים", en: "Professional Photos" },
  },
  contact: {
    title: { he: "בואו נדבר", en: "Let's talk" },
    cv: { he: "הורדת קורות חיים", en: "Download CV" },
    email: { he: "אימייל", en: "Email" },
    phone: { he: "טלפון", en: "Phone" },
  },
  langName: { he: "עברית", en: "English" },
} as const;

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
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "he" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  // Keep <html lang/dir> and persistence in sync with the active language.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dirFor(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === "he" ? "en" : "he")),
    [],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: dirFor(lang),
      setLang,
      toggle,
      t: (v: Bi) => v[lang],
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
