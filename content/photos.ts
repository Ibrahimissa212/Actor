import type { Bi } from "@/lib/i18n";

export type PhotoCategory = "professional";

export type PhotoItem = {
  id: string;
  category: PhotoCategory;
  /** Path under /public, e.g. "/images/headshot-01.jpg". */
  src: string;
  alt: Bi;
};

/**
 * Professional studio photos (a couple per look).
 * To add more: drop a compressed image into /public/images and add an entry.
 */
export const photos: PhotoItem[] = [
  {
    id: "headshot-01",
    category: "professional",
    src: "/images/headshot-01.jpg",
    alt: { he: "צילום סטודיו מקצועי — מבט רציני", en: "Professional studio portrait — intense look" },
  },
  {
    id: "headshot-02",
    category: "professional",
    src: "/images/headshot-02.jpg",
    alt: { he: "צילום סטודיו מקצועי — חיוך", en: "Professional studio portrait — smiling" },
  },
  {
    id: "headshot-03",
    category: "professional",
    src: "/images/headshot-03.jpg",
    alt: { he: "צילום סטודיו מקצועי — חולצה לבנה", en: "Professional studio portrait — white tee" },
  },
  {
    id: "headshot-04",
    category: "professional",
    src: "/images/headshot-04.jpg",
    alt: { he: "צילום סטודיו מקצועי — מבט הצידה", en: "Professional studio portrait — looking away" },
  },
  {
    id: "headshot-05",
    category: "professional",
    src: "/images/headshot-05.jpg",
    alt: { he: "צילום סטודיו מקצועי — חולצה שחורה", en: "Professional studio portrait — black tee" },
  },
  {
    id: "headshot-06",
    category: "professional",
    src: "/images/headshot-06.jpg",
    alt: { he: "צילום סטודיו מקצועי — פוזה יושבת", en: "Professional studio portrait — seated pose" },
  },
  {
    id: "headshot-07",
    category: "professional",
    src: "/images/headshot-07.jpg",
    alt: { he: "צילום סטודיו מקצועי — טונים בהירים", en: "Professional studio portrait — light tones" },
  },
  {
    id: "headshot-08",
    category: "professional",
    src: "/images/headshot-08.jpg",
    alt: { he: "צילום סטודיו מקצועי — מבט רגוע", en: "Professional studio portrait — calm expression" },
  },
];
