import type { Bi } from "@/lib/i18n";

/**
 * Central place for all personal / textual content.
 * Edit the Hebrew (he) and English (en) values below.
 * Anything marked with TODO is a placeholder you should replace.
 */

export const profile = {
  // TODO: replace with your real name
  name: { he: "השם שלך", en: "Your Name" } satisfies Bi,

  // Short role line shown under the name in the hero
  tagline: {
    he: "שחקן · מהנדס תוכנה בהסבה לעולם המשחק",
    en: "Actor · Software Engineer transitioning into acting",
  } satisfies Bi,

  // One-line hook for the hero
  heroLine: {
    he: "מספר סיפורים על הבמה ומול המצלמה — בקומדיה, בדרמה ובדמויות קיצון.",
    en: "Telling stories on stage and on camera — in comedy, drama, and bold characters.",
  } satisfies Bi,

  // TODO: replace with your real location (optional)
  location: { he: "ישראל", en: "Israel" } satisfies Bi,
};

export const about = {
  heading: { he: "קצת עליי", en: "About me" } satisfies Bi,

  paragraphs: [
    {
      he: "אני מהנדס תוכנה שעובד בהייטק, ובמקביל יצאתי למסע של הסבה לעולם המשחק — תחום שתמיד משך אותי. סיימתי לאחרונה קורס משחק בן חצי שנה בהסטודיו למשחק אצל גל אמיתי.",
      en: "I'm a software engineer working in hi-tech, and I've embarked on a transition into acting — a craft that has always drawn me in. I recently completed a six-month acting course at Gal Amitai's Acting Studio.",
    },
    {
      he: "במהלך הקורס עבדתי על דיאלוגים קומיים ודרמטיים, מונולוגים, ודמות קיצון מאתגרת — דמות של אדם עם שיתוק מוחין שאוהב את החיים: יוצא למסיבות, מטייל ומכיר אנשים חדשים. עבדתי גם רבות על משחק מול מצלמה.",
      en: "During the course I worked on comedic and dramatic dialogues, monologues, and a challenging character role — a person with cerebral palsy who loves life: going to parties, travelling, and meeting new people. I also did extensive on-camera work.",
    },
    {
      he: "הרקע ההנדסי שלי נותן לי משמעת, יכולת ניתוח של טקסט ודמות, ויכולת ללמוד מהר ולעבוד תחת לחץ — ואני מביא את כל אלה אל תוך העבודה השחקנית.",
      en: "My engineering background gives me discipline, an analytical eye for text and character, and the ability to learn fast and perform under pressure — all of which I bring into my acting work.",
    },
  ] satisfies Bi[],

  // Small fact chips shown next to the bio
  facts: [
    { he: "הסטודיו למשחק — גל אמיתי", en: "Gal Amitai Acting Studio" },
    { he: "משחק על הבמה", en: "Stage acting" },
    { he: "משחק מול מצלמה", en: "On-camera acting" },
    { he: "קומדיה ודרמה", en: "Comedy & drama" },
  ] satisfies Bi[],
};

export const showreel = {
  heading: { he: "סרטון תקציר", en: "Showreel" } satisfies Bi,
  subtitle: {
    he: "מבחר רגעים נבחרים מהעבודה שלי",
    en: "A selection of highlights from my work",
  } satisfies Bi,
  // TODO: put your Vimeo showreel ID here (e.g. "123456789").
  // Leave empty ("") to hide the showreel section until you have one.
  vimeoId: "",
};

export const contact = {
  heading: { he: "בואו ניצור קשר", en: "Get in touch" } satisfies Bi,
  blurb: {
    he: "מחפש ייצוג, אודישנים ושיתופי פעולה. מוזמנים לפנות אליי.",
    en: "Looking for representation, auditions, and collaborations. Feel free to reach out.",
  } satisfies Bi,

  // TODO: replace with your real details
  email: "your.email@example.com",
  phone: "+972-50-000-0000",

  // TODO: add/remove social links. Leave url empty ("") to hide a link.
  socials: [
    { label: "Instagram", url: "" },
    { label: "WhatsApp", url: "" },
    { label: "Spotlight / Backstage", url: "" },
  ],

  // CV file lives in /public/cv/cv.pdf — replace that file with your own.
  cvPath: "/cv/cv.pdf",
};
