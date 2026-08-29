import type { Bi } from "@/lib/i18n";

/**
 * Central place for all personal / textual content.
 * Edit the Hebrew (he), English (en) and Arabic (ar) values below.
 */

export const profile = {
  name: { he: "איברהים עיסא", en: "Ibrahim Issa", ar: "إبراهيم عيسى" } satisfies Bi,

  // Short "motto" line shown under the name in the hero (a pun on the name).
  tagline: {
    he: "מוטו — איברהים ונהנים (צוחקים, מתרגשים, אוהבים ועפים על החיים)",
    en: "Motto — Ibrahim, chasing the dream: laughing, feeling, loving, riding life's stream.",
    ar: "شعار — مع إبراهيم النعيم: نضحك، نتأثّر، نحبّ، ونطير في الحياة.",
  } satisfies Bi,

  // One-line professional hook for the hero.
  heroLine: {
    he: "מהנדס תוכנה בוגר הטכניון 👨‍💻🛠️ ושחקן בוגר הסטודיו למשחק 🎭🎬 — עם רקע וניסיון בעולם המשחק: הופעתי בצילומי פרסומת וליוויתי חברים במשך שנים בהכנה לאודישנים. חובב משחק, קולנוע וסדרות מושבע — ברמה של מבקר.",
    en: "Technion-graduate software engineer 👨‍💻🛠️ and studio-trained actor 🎭🎬 — with real background and experience in acting: I've appeared in a commercial shoot and spent years helping friends prepare for auditions. A devoted fan of acting, film and TV — at a critic's level.",
    ar: "مهندس برمجيات خرّيج التخنيون 👨‍💻🛠️ وممثّل خرّيج استوديو التمثيل 🎭🎬 — بخلفية وخبرة في عالم التمثيل: شاركتُ في تصوير إعلان ورافقتُ أصدقاء لسنوات في التحضير لتجارب الأداء. عاشق للتمثيل والسينما والمسلسلات — على مستوى ناقد.",
  } satisfies Bi,

  location: { he: "ישראל", en: "Israel", ar: "إسرائيل" } satisfies Bi,
};

export const about = {
  heading: { he: "קצת עליי", en: "About me", ar: "نبذة عني" } satisfies Bi,

  paragraphs: [
    {
      he: "אני מהנדס תוכנה בוגר הטכניון שעובד בהייטק, ובמקביל יצאתי למסע של הסבה לעולם המשחק — תחום שתמיד משך אותי. סיימתי לאחרונה קורס משחק בן חצי שנה בהסטודיו למשחק אצל גל אמיתי.",
      en: "I'm a Technion-graduate software engineer working in hi-tech, and I've embarked on a transition into acting — a craft that has always drawn me in. I recently completed a six-month acting course at Gal Amitai's Acting Studio.",
      ar: "أنا مهندس برمجيات خرّيج التخنيون وأعمل في مجال الهايتك، وفي الوقت نفسه بدأتُ رحلة انتقال إلى عالم التمثيل — وهو مجال شدّني دائمًا. أنهيتُ مؤخّرًا دورة تمثيل مدّتها نصف عام في استوديو التمثيل لدى غال أميتاي.",
    },
    {
      he: "במהלך הקורס עבדתי על דיאלוגים קומיים ודרמטיים, מונולוגים, ודמות קיצון מאתגרת — דמות של אדם עם שיתוק מוחין שאוהב את החיים: יוצא למסיבות, מטייל ומכיר אנשים חדשים. עבדתי גם רבות על משחק מול מצלמה.",
      en: "During the course I worked on comedic and dramatic dialogues, monologues, and a challenging character role — a person with cerebral palsy who loves life: going to parties, travelling, and meeting new people. I also did extensive on-camera work.",
      ar: "خلال الدورة عملتُ على حوارات كوميدية ودرامية، ومونولوجات، وشخصية تحدٍّ مميّزة — شخص مصاب بالشلل الدماغي يحبّ الحياة: يخرج إلى الحفلات ويسافر ويتعرّف على أناس جدد. كما تدرّبتُ كثيرًا على التمثيل أمام الكاميرا.",
    },
    {
      he: "הרקע ההנדסי שלי נותן לי משמעת, יכולת ניתוח של טקסט ודמות, ויכולת ללמוד מהר ולעבוד תחת לחץ — ואני מביא את כל אלה אל תוך העבודה השחקנית.",
      en: "My engineering background gives me discipline, an analytical eye for text and character, and the ability to learn fast and perform under pressure — all of which I bring into my acting work.",
      ar: "خلفيتي الهندسية تمنحني الانضباط، وعينًا تحليلية للنصّ والشخصية، والقدرة على التعلّم السريع والأداء تحت الضغط — وأُدخِل كلّ ذلك في عملي التمثيلي.",
    },
  ] satisfies Bi[],

  facts: [
    { he: "הסטודיו למשחק — גל אמיתי", en: "Gal Amitai Acting Studio", ar: "استوديو التمثيل — غال أميتاي" },
    { he: "בוגר הטכניון", en: "Technion graduate", ar: "خرّيج التخنيون" },
    { he: "משחק על הבמה", en: "Stage acting", ar: "تمثيل مسرحي" },
    { he: "משחק מול מצלמה", en: "On-camera acting", ar: "تمثيل أمام الكاميرا" },
    { he: "צילום לפרסומות", en: "Commercial shoots", ar: "تصوير إعلانات" },
    { he: "הכנת אודישנים", en: "Audition prep", ar: "تحضير لتجارب الأداء" },
  ] satisfies Bi[],

  languagesHeading: {
    he: "שפות ומבטאים",
    en: "Languages & Accents",
    ar: "اللغات واللهجات",
  } satisfies Bi,

  // Casting-relevant languages and accents.
  languages: [
    { he: "ערבית — שפת אם", en: "Arabic — native", ar: "العربية — لغة الأم" },
    { he: "עברית — שפת אם", en: "Hebrew — native", ar: "العبرية — لغة الأم" },
    { he: "אנגלית — שליטה טובה", en: "English — proficient", ar: "الإنجليزية — إتقان جيّد" },
    {
      he: "עברית במבטא צרפתי",
      en: "Hebrew with a French accent",
      ar: "العبرية بلكنة فرنسية",
    },
    { he: "צרפתית — רמה בסיסית", en: "French — basic", ar: "الفرنسية — مستوى أساسي" },
  ] satisfies Bi[],
};

export const showreel = {
  heading: { he: "סרטון תקציר", en: "Showreel", ar: "ملخّص" } satisfies Bi,
  subtitle: {
    he: "מבחר רגעים נבחרים מהעבודה שלי",
    en: "A selection of highlights from my work",
    ar: "مجموعة مختارة من أبرز لحظات عملي",
  } satisfies Bi,
  // TODO: put your Vimeo showreel ID here (e.g. "123456789").
  // Leave empty ("") to hide the showreel section until you have one.
  vimeoId: "",
};

export const contact = {
  heading: { he: "בואו ניצור קשר", en: "Get in touch", ar: "لنتواصل" } satisfies Bi,
  blurb: {
    he: "מחפש ייצוג, אודישנים ושיתופי פעולה. מוזמנים לפנות אליי.",
    en: "Looking for representation, auditions, and collaborations. Feel free to reach out.",
    ar: "أبحث عن تمثيل (وكالة) وتجارب أداء وتعاونات. لا تتردّدوا في التواصل معي.",
  } satisfies Bi,

  email: "ibrahim.issa212@gmail.com",
  phone: "+972-54-328-3232",

  socials: [
    { label: "Instagram", url: "https://www.instagram.com/ibrahim_issa/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/ibrahim-issa-17409774/" },
    { label: "Facebook", url: "https://www.facebook.com/ibrahim.issa.796" },
  ],

  // CV file lives in /public/cv/cv.pdf. Leave "" to hide the download
  // button until a CV is added.
  cvPath: "",
};
