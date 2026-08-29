"use client";

import { useLanguage } from "@/lib/i18n";
import { about } from "@/content/site";
import { Section, SectionHeading } from "./Section";

export function About() {
  const { t } = useLanguage();

  return (
    <Section id="about" className="bg-bg-soft">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={{ he: "אודות", en: "About", ar: "عن" }}
          title={about.heading}
        />

        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-5 text-base leading-relaxed text-fg-muted md:col-span-2 sm:text-lg">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{t(p)}</p>
            ))}
          </div>

          <ul className="flex flex-col gap-3">
            {about.facts.map((fact, i) => (
              <li
                key={i}
                className="rounded-xl border border-border bg-bg-card px-4 py-3 text-sm font-medium text-fg"
              >
                <span className="me-2 text-accent">—</span>
                {t(fact)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
