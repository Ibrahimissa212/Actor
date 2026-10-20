"use client";

import { createContext, useContext, type ReactNode } from "react";
import { profile, about, showreel, contact } from "@/content/site";
import { videos, type VideoItem, type VideoCategory } from "@/content/videos";
import { photos, type PhotoItem } from "@/content/photos";
import { courseMedia, type CourseMedia } from "@/content/course";
import { ui } from "@/content/ui";
import type { Bi } from "./i18n";

type Mutable<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Mutable<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: Mutable<T[K]> }
      : T;
export type SiteContent = {
  profile: Mutable<typeof profile>;
  about: Mutable<typeof about>;
  showreel: Mutable<typeof showreel>;
  contact: Mutable<typeof contact>;
  ui: Mutable<typeof ui>;
  labels: Record<string, Bi>;
  videos: (VideoItem & { hidden?: boolean })[];
  photos: (PhotoItem & { hidden?: boolean })[];
  courseMedia: (CourseMedia & { hidden?: boolean })[];
  videoLayout: "grouped" | "custom";
  categoryOrder: VideoCategory[];
  seo: { title: string; description: string; image: string };
};
export const defaultContent: SiteContent = {
  profile,
  about,
  showreel,
  contact,
  ui,
  videos,
  photos,
  courseMedia,
  videoLayout: "grouped",
  categoryOrder: ["commercial", "course", "professional"],
  seo: {
    title: "Ibrahim Issa — Actor",
    description:
      "Ibrahim Issa — actor and Technion-graduate software engineer. Stage and on-camera work, professional photos, and course reels.",
    image: "/images/headshot-01.jpg",
  },
  labels: {
    aboutEyebrow: { he: "אודות", en: "About", ar: "عن" },
    watchEyebrow: { he: "צפו", en: "Watch", ar: "شاهد" },
    portfolioEyebrow: { he: "תיק עבודות", en: "Portfolio", ar: "أعمالي" },
    videoTitle: { he: "וידאו", en: "Video", ar: "فيديو" },
    galleryEyebrow: { he: "גלריה", en: "Gallery", ar: "معرض" },
    galleryTitle: {
      he: "תמונות ווידאו",
      en: "Photos & Video",
      ar: "صور وفيديو",
    },
    courseTab: {
      he: "מהקורס — תמונות ווידאו",
      en: "From the Course — Photos & Video",
      ar: "من الدورة — صور وفيديو",
    },
    menu: { he: "תפריט", en: "Menu", ar: "القائمة" },
    previous: { he: "הקודם", en: "Previous", ar: "السابق" },
    next: { he: "הבא", en: "Next", ar: "التالي" },
    language: { he: "שפה", en: "Language", ar: "اللغة" },
    privacy: { he: "פרטיות", en: "Privacy", ar: "الخصوصية" },
    privacyText: {
      he: "האתר מודד ביקורים, פתיחת תמונות וניגון סרטונים. קישור אישי עשוי לשייך את הפעילות לפנייה שנשלחה. הנתונים נשמרים עד 90 יום, ללא שמירת כתובת IP לצורך זיהוי.",
      en: "This site measures visits, opened photos and video playback. A personalised link may associate activity with an outreach message. Activity is kept for up to 90 days without storing IP addresses for identification.",
      ar: "يقيس الموقع الزيارات وفتح الصور وتشغيل الفيديو. قد يربط الرابط المخصّص النشاط برسالة تواصل. تُحفظ البيانات لمدة تصل إلى 90 يومًا دون تخزين عنوان IP للتعريف بالزائر.",
    },
    trackingOff: {
      he: "כיבוי מדידת שימוש בדפדפן הזה",
      en: "Disable usage measurement in this browser",
      ar: "إيقاف قياس الاستخدام في هذا المتصفح",
    },
    trackingOn: {
      he: "הפעלת מדידת שימוש בדפדפן הזה",
      en: "Enable usage measurement in this browser",
      ar: "تفعيل قياس الاستخدام في هذا المتصفح",
    },
    footer: { he: "איברהים עיסא", en: "Ibrahim Issa", ar: "إبراهيم عيسى" },
  },
};
const ContentContext = createContext<SiteContent>(defaultContent);
export function ContentProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: ReactNode;
}) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}
export function useContent() {
  return useContext(ContentContext);
}
