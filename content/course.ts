import type { Bi } from "@/lib/i18n";

/**
 * Media (photos + videos) captured during the acting course — stage and
 * on-camera work. Shown in the "From the Course" gallery tab.
 * Files live under /public/images/course and /public/videos/course.
 */
export type CourseMedia =
  | { id: string; kind: "video"; src: string; title: Bi; alt: Bi }
  | { id: string; kind: "photo"; src: string; alt: Bi };

const courseVideos: CourseMedia[] = [
  {
    id: "cv-halil",
    kind: "video",
    src: "/videos/course/halil.mp4",
    title: { he: "חליל", en: "Halil", ar: "خليل" },
    alt: { he: "קטע וידאו מהקורס — חליל", en: "Course scene — Halil" },
  },
  {
    id: "cv-clip-1",
    kind: "video",
    src: "/videos/course/clip-1.mp4",
    title: { he: "קטע מהקורס (1)", en: "Course Clip (1)", ar: "مقطع من الدورة (1)" },
    alt: { he: "קטע וידאו מהקורס 1", en: "Course clip 1" },
  },
  {
    id: "cv-clip-2",
    kind: "video",
    src: "/videos/course/clip-2.mp4",
    title: { he: "קטע מהקורס (2)", en: "Course Clip (2)", ar: "مقطع من الدورة (2)" },
    alt: { he: "קטע וידאו מהקורס 2", en: "Course clip 2" },
  },
];

function photo(id: string, file: string, he: string, en: string): CourseMedia {
  return { id, kind: "photo", src: `/images/course/${file}`, alt: { he, en } };
}

const coursePhotos: CourseMedia[] = [
  photo("cp-08", "course-08.jpg", "במה — דמות אינטנסיבית עם אביזר אקדח (שחור־לבן)", "Intense scene with a prop pistol (b&w)"),
  photo("cp-05", "course-05.jpg", "סצנה דרמטית על הבמה — שלושה שחקנים", "Dramatic stage scene — three actors"),
  photo("cp-09", "course-09.jpg", "סצנה דרמטית מול מצלמה — עימות", "Dramatic on-camera scene — confrontation"),
  photo("cp-01", "course-01.jpg", "סצנה על הבמה — דיאלוג על הספה", "Stage scene — couch dialogue"),
  photo("cp-02", "course-02.jpg", "סצנה על הבמה — דיאלוג", "Stage scene — dialogue"),
  photo("cp-19", "course-19.jpg", "משחק מול מצלמה — קלוז־אפ", "On-camera acting — close-up"),
  photo("cp-04", "course-04.jpg", "על הבמה — סצנה קבוצתית (שחור־לבן)", "On stage — ensemble scene (b&w)"),
  photo("cp-12", "course-12.jpg", "על הבמה — רגע קומי אקספרסיבי", "On stage — expressive comedic moment"),
  photo("cp-20", "course-20.jpg", "על הבמה — סצנה קבוצתית", "On stage — ensemble scene"),
  photo("cp-07", "course-07.jpg", "יום צילום מול מצלמה בסטודיו", "On-camera studio shoot day"),
  photo("cp-17", "course-17.jpg", "משחק מול מצלמה — חיוך", "On-camera acting — smiling"),
  photo("cp-03", "course-03.jpg", "על הבמה — דיאלוג בזוג", "On stage — two-hander dialogue"),
  photo("cp-06", "course-06.jpg", "על הבמה — סצנה קבוצתית", "On stage — ensemble scene"),
  photo("cp-18", "course-18.jpg", "מאחורי הקלעים — צילום מול מצלמה", "Behind the scenes — on-camera shoot"),
  photo("cp-13", "course-13.jpg", "מאחורי הקלעים — סט הצילום", "Behind the scenes — on set"),
  photo("cp-15", "course-15.jpg", "מאחורי הקלעים — סצנה מול מצלמה", "Behind the scenes — on-camera scene"),
  photo("cp-10", "course-10.jpg", "קבלת תעודת סיום הקורס", "Receiving the course certificate"),
  photo("cp-11", "course-11.jpg", "תמונת מחזור — סיום הקורס", "Class photo — course graduation"),
];

export const courseMedia: CourseMedia[] = [...courseVideos, ...coursePhotos];
