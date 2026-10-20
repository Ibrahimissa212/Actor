"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { useContent } from "@/lib/content";
import { disableMeasurement, measurementDisabled } from "@/lib/tracking";
export function Footer() {
  const { t } = useLanguage();
  const { labels } = useContent();
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    void Promise.resolve().then(() => setDisabled(measurementDisabled()));
  }, []);
  return (
    <footer className="border-t border-border px-6 py-8 text-center text-sm text-fg-muted">
      <p>
        © {new Date().getFullYear()} {t(labels.footer)}
      </p>
      <details className="mx-auto mt-4 max-w-xl">
        <summary className="cursor-pointer">{t(labels.privacy)}</summary>
        <p className="mt-3 leading-relaxed">{t(labels.privacyText)}</p>
        <button
          className="mt-3 underline"
          onClick={() => {
            const next = !measurementDisabled();
            disableMeasurement(next);
            setDisabled(next);
          }}
        >
          {t(disabled ? labels.trackingOn : labels.trackingOff)}
        </button>
      </details>
    </footer>
  );
}
