import type { Bi } from "@/lib/i18n";

export type VideoCategory = "professional" | "course";

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
    id: "course-reel-1",
    category: "course",
    title: {
      he: "מבחר קטעים — במה ומצלמה (1)",
      en: "Selected Clips — Stage & Camera (1)",
      ar: "مقاطع مختارة — مسرح وكاميرا (1)",
    },
    description: {
      he: "אוסף רגעים מתוך עבודות הבמה והמצלמה שצולמו במהלך הקורס.",
      en: "A montage of moments from my stage and on-camera work during the course.",
      ar: "مجموعة لحظات من أعمالي المسرحية وأمام الكاميرا خلال الدورة.",
    },
    src: "/videos/course-1.mp4",
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
