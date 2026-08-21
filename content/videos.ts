import type { Bi } from "@/lib/i18n";

export type VideoCategory = "stage" | "camera";

export type VideoItem = {
  id: string;
  category: VideoCategory;
  title: Bi;
  description: Bi;
  /**
   * Vimeo numeric video ID (the number in the URL, e.g.
   * https://vimeo.com/123456789  ->  "123456789").
   * Leave "" for items you haven't uploaded yet; they show a
   * "coming soon" placeholder instead of a broken player.
   */
  vimeoId: string;
  /**
   * Optional Vimeo private hash (for unlisted videos that use a
   * link like vimeo.com/123456789/abcdef123). Leave "" if not needed.
   */
  vimeoHash?: string;
};

/**
 * Add a video by adding an object to this list.
 * Categories: "stage" (theatre / on stage) and "camera" (on-camera work).
 */
export const videos: VideoItem[] = [
  {
    id: "stage-comic",
    category: "stage",
    title: { he: "דיאלוג קומי", en: "Comedic Dialogue" },
    description: {
      he: "סצנה קומית מול שחקן נוסף, מתוך עבודת הבמה בקורס.",
      en: "A comedic two-hander scene from my stage work in the course.",
    },
    vimeoId: "",
  },
  {
    id: "stage-drama",
    category: "stage",
    title: { he: "דיאלוג דרמטי", en: "Dramatic Dialogue" },
    description: {
      he: "סצנה דרמטית מול שחקן נוסף, עבודת רגש על הבמה.",
      en: "A dramatic two-hander scene — emotional stage work.",
    },
    vimeoId: "",
  },
  {
    id: "stage-extreme-character",
    category: "stage",
    title: { he: "דמות קיצון", en: "Bold Character Role" },
    description: {
      he: "דמות של אדם עם שיתוק מוחין שאוהב את החיים — מסיבות, טיולים והיכרויות. עבודת גוף וקול מאתגרת.",
      en: "A person with cerebral palsy who loves life — parties, travel, and new connections. A demanding physical and vocal transformation.",
    },
    vimeoId: "",
  },
  {
    id: "camera-drama",
    category: "camera",
    title: { he: "דיאלוג דרמטי — מול מצלמה", en: "Dramatic Dialogue — On Camera" },
    description: {
      he: "עבודת משחק דרמטית מול מצלמה, מתוך שיעורי המצלמה.",
      en: "Dramatic on-camera acting from the camera classes.",
    },
    vimeoId: "",
  },
  {
    id: "camera-comic",
    category: "camera",
    title: { he: "דיאלוג קומי — מול מצלמה", en: "Comedic Dialogue — On Camera" },
    description: {
      he: "סצנה קומית מול מצלמה, עם דגש על טיימינג ונוכחות.",
      en: "A comedic on-camera scene focused on timing and presence.",
    },
    vimeoId: "",
  },
  {
    id: "camera-monologue",
    category: "camera",
    title: { he: "מונולוג — מול מצלמה", en: "Monologue — On Camera" },
    description: {
      he: "מונולוג מול מצלמה, עבודת קלוז־אפ ורגש.",
      en: "An on-camera monologue — close-up, emotional work.",
    },
    vimeoId: "",
  },
];
