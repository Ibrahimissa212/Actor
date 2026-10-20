"use client";

import { useContent } from "@/lib/content";

import { useLanguage } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { VimeoPlayer } from "./VimeoPlayer";

export function Showreel() {
  const { showreel, labels } = useContent();
  const { t } = useLanguage();

  // Hidden until a showreel Vimeo ID is provided in content/site.ts
  if (!showreel.vimeoId) return null;

  return (
    <Section id="showreel" className="bg-bg-soft">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={labels.watchEyebrow}
          title={showreel.heading}
        />
        <p className="mb-8 -mt-6 text-base text-fg-muted sm:text-lg">
          {t(showreel.subtitle)}
        </p>
        <VimeoPlayer vimeoId={showreel.vimeoId} title={t(showreel.heading)} />
      </div>
    </Section>
  );
}
