import type { Bi } from "@/lib/i18n";

export type PhotoCategory = "headshots" | "classes";

export type PhotoItem = {
  id: string;
  category: PhotoCategory;
  /** Path under /public, e.g. "/images/headshot-1.jpg". */
  src: string;
  alt: Bi;
};

/**
 * Add a photo by:
 *   1. Dropping the (compressed!) image into /public/images
 *   2. Adding an entry here pointing to it.
 *
 * Tip: keep images under ~300KB. Resize to ~1600px on the long edge.
 * The entries below point to placeholder files — replace them with yours.
 */
export const photos: PhotoItem[] = [
  {
    id: "headshot-1",
    category: "headshots",
    src: "/images/headshot-1.jpg",
    alt: { he: "צילום מקצועי 1", en: "Professional headshot 1" },
  },
  {
    id: "headshot-2",
    category: "headshots",
    src: "/images/headshot-2.jpg",
    alt: { he: "צילום מקצועי 2", en: "Professional headshot 2" },
  },
  {
    id: "headshot-3",
    category: "headshots",
    src: "/images/headshot-3.jpg",
    alt: { he: "צילום מקצועי 3", en: "Professional headshot 3" },
  },
  {
    id: "class-1",
    category: "classes",
    src: "/images/class-1.jpg",
    alt: { he: "מהשיעורים — על הבמה 1", en: "From the classes — on stage 1" },
  },
  {
    id: "class-2",
    category: "classes",
    src: "/images/class-2.jpg",
    alt: { he: "מהשיעורים — על הבמה 2", en: "From the classes — on stage 2" },
  },
  {
    id: "class-3",
    category: "classes",
    src: "/images/class-3.jpg",
    alt: { he: "מהשיעורים — דמות קיצון", en: "From the classes — character role" },
  },
];
