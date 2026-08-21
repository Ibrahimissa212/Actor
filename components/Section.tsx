"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLanguage, type Bi } from "@/lib/i18n";

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={`scroll-mt-24 px-6 py-20 sm:py-28 md:px-10 ${className}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow?: Bi;
  title: Bi;
}) {
  const { t } = useLanguage();
  return (
    <div className="mb-10 sm:mb-14">
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-accent">
          {t(eyebrow)}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl md:text-5xl">
        {t(title)}
      </h2>
      <div className="mt-4 h-px w-24 bg-gradient-to-r from-accent to-transparent" />
    </div>
  );
}
