"use client";
import { useEffect } from "react";
import { track } from "@/lib/tracking";
export function Tracking() {
  useEffect(() => {
    let visited = false;
    const start = () => {
      if (document.visibilityState !== "visible" || visited) return;
      visited = true;
      void track("visit");
    };
    const timer = setTimeout(start, 2000);
    document.addEventListener("visibilitychange", start);
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        if (document.visibilityState !== "visible") return;
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen.has(entry.target.id)) {
            seen.add(entry.target.id);
            void track("section", entry.target.id);
          }
        });
      },
      { threshold: 0.25 },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((el) => io.observe(el));
    const click = (event: MouseEvent) => {
      const a = (event.target as Element).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("mailto:")) void track("contact", "email");
      else if (href.startsWith("tel:")) void track("contact", "phone");
      else if (a.hasAttribute("download")) void track("cv", "cv");
      else if (a.target === "_blank" && !href.includes("/admin"))
        void track("contact", a.textContent?.trim() || "social");
    };
    document.addEventListener("click", click);
    return () => {
      clearTimeout(timer);
      io.disconnect();
      document.removeEventListener("click", click);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);
  return null;
}
