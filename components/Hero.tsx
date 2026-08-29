"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { ui, useLanguage } from "@/lib/i18n";
import { profile } from "@/content/site";
import { HeroSlideshow } from "./HeroSlideshow";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      {/* Background photo slideshow */}
      <HeroSlideshow />

      {/* Legibility scrim: dark gradient + soft vignette + accent glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/85 via-bg/60 to-bg"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background:radial-gradient(120%_90%_at_50%_50%,transparent_0%,rgba(11,11,14,0.55)_100%),radial-gradient(60%_50%_at_50%_0%,rgba(216,166,87,0.14)_0%,rgba(216,166,87,0)_70%)]"
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-accent"
        >
          {t(profile.location)}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-5xl font-bold tracking-tight text-fg sm:text-6xl md:text-7xl"
        >
          {t(profile.name)}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-5 text-lg font-medium text-accent-soft sm:text-xl"
        >
          {t(profile.tagline)}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg"
        >
          {t(profile.heroLine)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#video"
            className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-[#1a1306] transition-transform hover:scale-[1.03]"
          >
            {t(ui.nav.video)}
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-7 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent"
          >
            {t(ui.nav.contact)}
          </a>
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label={t(ui.hero.scroll)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-fg-muted transition-colors hover:text-accent"
      >
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
