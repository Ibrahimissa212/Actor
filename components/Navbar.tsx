"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ui, useLanguage } from "@/lib/i18n";
import { profile, showreel } from "@/content/site";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavLink = { href: string; label: (typeof ui.nav)[keyof typeof ui.nav] };

const baseLinks: NavLink[] = [
  { href: "#about", label: ui.nav.about },
  { href: "#video", label: ui.nav.video },
  { href: "#photos", label: ui.nav.photos },
  { href: "#contact", label: ui.nav.contact },
];

export function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: NavLink[] = showreel.vimeoId
    ? [{ href: "#showreel", label: ui.nav.showreel }, ...baseLinks]
    : baseLinks;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-fg transition-colors hover:text-accent"
        >
          {t(profile.name)}
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
              {t(link.label)}
            </a>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-1 text-fg"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open ? (
        <div className="border-t border-border bg-bg/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col px-6 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-fg-muted transition-colors hover:text-fg"
              >
                {t(link.label)}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
