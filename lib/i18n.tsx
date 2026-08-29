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

/** UI chrome strings (navigation, buttons, labels). */
export const ui = {
  nav: {
    about: { he: "אודות", en: "About", ar: "عن" },
    showreel: { he: "סרטון תקציר", en: "Showreel", ar: "ملخص" },
    video: { he: "וידאו", en: "Video", ar: "فيديو" },
    photos: { he: "תמונות", en: "Photos", ar: "صور" },
    contact: { he: "צור קשר", en: "Contact", ar: "تواصل" },
  },
  hero: {
    scroll: { he: "גלול למטה", en: "Scroll down", ar: "مرّر للأسفل" },
  },
  video: {
    commercial: {
      he: "פרסומות ומסך",
      en: "Commercials & Screen",
      ar: "إعلانات وشاشة",
    },
    professional: {
      he: "צילומים מקצועיים",
      en: "Professional Shoot",
      ar: "تصوير احترافي",
    },
    course: {
      he: "קטעים מהקורס — במה ומצלמה",
      en: "From the Course — Stage & Camera",
      ar: "من الدورة — مسرح وكاميرا",
    },
    play: { he: "נגן", en: "Play", ar: "تشغيل" },
    close: { he: "סגור", en: "Close", ar: "إغلاق" },
  },
  photos: {
    title: { he: "צילומים מקצועיים", en: "Professional Photos", ar: "صور احترافية" },
  },
  contact: {
    title: { he: "בואו נדבר", en: "Let's talk", ar: "لنتحدّث" },
    cv: { he: "הורדת קורות חיים", en: "Download CV", ar: "تحميل السيرة الذاتية" },
    email: { he: "אימייל", en: "Email", ar: "البريد الإلكتروني" },
    phone: { he: "טלפון", en: "Phone", ar: "هاتف" },
  },
  langName: { he: "עברית", en: "English", ar: "العربية" },
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
    if (stored === "he" || stored === "en" || stored === "ar") {
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
      t: (v: Bi) => v[lang] ?? v.he,
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
