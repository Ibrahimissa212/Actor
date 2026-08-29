import type { Bi } from "@/lib/i18n";

export type VideoCategory = "commercial" | "professional" | "course";

export type VideoItem = {
  id: string;
  category: VideoCategory;
  title: Bi;
  description: Bi;
  /**
   * Path to a self-hosted video under /public, e.g. "/videos/course-1.mp4".
   * These are served for free as static files on Cloudflare.
   */
  src: string;
  /** Optional poster image under /public shown before playback. */
  poster?: string;
};

/**
 * Add a video by dropping the file into /public/videos and adding an
 * entry here. Categories:
 *   - "professional": the studio photoshoot video
 *   - "course": montage clips from the acting course (stage & camera)
 */
export const videos: VideoItem[] = [
  {
    id: "bigbrother-promo-2020",
    category: "commercial",
    title: {
      he: "פרומו לאח הגדול 2021",
      en: "Big Brother Israel — 2021 Promo",
      ar: "برومو الأخ الأكبر 2021",
    },
    description: {
      he: "פרומו ששודר לקראת עונת האח הגדול 2021 (צולם ב־2020) — אני מופיע בו.",
      en: "An aired promo for the Big Brother Israel 2021 season (shot in 2020) — I appear in it.",
      ar: "برومو بُثّ لموسم الأخ الأكبر 2021 (صُوّر عام 2020) — أظهر فيه.",
    },
    src: "/videos/bigbrother-promo-2020.mp4",
  },
  {
    id: "studio-shoot",
    category: "professional",
    title: {
      he: "וידאו מצילומי הסטודיו",
      en: "Studio Shoot Video",
      ar: "فيديو من تصوير الاستوديو",
    },
    description: {
      he: "וידאו מתוך יום הצילומים המקצועי בסטודיו.",
      en: "A video from my professional studio photoshoot.",
      ar: "فيديو من يوم التصوير الاحترافي في الاستوديو.",
    },
    src: "/videos/studio.mp4",
  },
  {
    id: "character-cerebral-palsy",
    category: "course",
    title: {
      he: "דמות קיצון — בחור עם שיתוק מוחין שחי את החיים",
      en: "Bold Character — A Guy with Cerebral Palsy Living Life to the Fullest",
      ar: "شخصية جريئة — شاب مصاب بالشلل الدماغي يعيش الحياة بأكملها",
    },
    description: {
      he: "מונולוג בדמות אדם עם שיתוק מוחין שאוהב את החיים — עבודת גוף וקול מאתגרת.",
      en: "A monologue as a person with cerebral palsy who loves life — demanding physical and vocal work.",
      ar: "مونولوج بشخصية شخص مصاب بالشلل الدماغي يحبّ الحياة — عمل جسدي وصوتي متطلّب.",
    },
    src: "/videos/course/life-motto.mp4",
  },
  {
    id: "character-bar",
    category: "course",
    title: {
      he: "דמות קיצון — הקאתי בבר",
      en: "Bold Character — Threw Up at the Bar",
      ar: "شخصية جريئة — تقيّأتُ في الحانة",
    },
    description: {
      he: "קטע קומי בדמות קיצון — \u201eהקאתי בבר\u201d.",
      en: "A comedic bold-character scene — \u201cThrew Up at the Bar\u201d.",
      ar: "مشهد كوميدي بشخصية جريئة — «تقيّأتُ في الحانة».",
    },
    src: "/videos/course/bar-scene.mp4",
  },
  {
    id: "course-reel-2",
    category: "course",
    title: {
      he: "מבחר קטעים — במה ומצלמה (2)",
      en: "Selected Clips — Stage & Camera (2)",
      ar: "مقاطع مختارة — مسرح وكاميرا (2)",
    },
    description: {
      he: "עוד מבחר קטעים מעבודות הבמה והמצלמה מהקורס.",
      en: "More selected clips from my stage and on-camera work in the course.",
      ar: "مقاطع مختارة إضافية من أعمالي المسرحية وأمام الكاميرا في الدورة.",
    },
    src: "/videos/course-2.mp4",
  },
];
