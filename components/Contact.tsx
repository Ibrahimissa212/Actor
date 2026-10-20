"use client";

import { useContent } from "@/lib/content";

import { Download, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

export function Contact() {
  const { contact, ui } = useContent();
  const { t } = useLanguage();
  const socials = contact.socials.filter((s) => s.url);

  return (
    <Section id="contact" className="bg-bg-soft">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading title={contact.heading} />
        <p className="-mt-6 mb-10 text-base text-fg-muted sm:text-lg">
          {t(contact.blurb)}
        </p>

        <div className="flex flex-col items-center gap-4">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-3 text-lg font-medium text-fg transition-colors hover:text-accent"
          >
            <Mail className="h-5 w-5 text-accent" />
            {contact.email}
          </a>
          <a
            href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
            className="inline-flex items-center gap-3 text-lg font-medium text-fg transition-colors hover:text-accent"
          >
            <Phone className="h-5 w-5 text-accent" />
            <span dir="ltr">{contact.phone}</span>
          </a>
        </div>

        {contact.cvPath ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={contact.cvPath}
              download
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-[#1a1306] transition-transform hover:scale-[1.03]"
            >
              <Download className="h-4 w-4" />
              {t(ui.contact.cv)}
            </a>
          </div>
        ) : null}

        {socials.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-fg-muted transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
