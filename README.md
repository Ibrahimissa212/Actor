# Actor Portfolio · אתר תיק עבודות לשחקן

אתר תיק עבודות אישי, דו-לשוני (עברית RTL + אנגלית LTR), לבניית נוכחות מקצועית מול סוכנויות.
נבנה עם **Next.js 16 + TypeScript + Tailwind CSS v4 + Framer Motion**.

---

## הרצה מקומית (Local development)

```bash
npm install      # פעם ראשונה בלבד
npm run dev      # פיתוח -> http://localhost:3000
npm run build    # בדיקת build לפני העלאה
```

---

## איפה יושב כל דבר

| תוכן | מיקום | הערות |
|------|--------|-------|
| **קוד** | Git / GitHub | לא Google Drive |
| **וידאו** | Vimeo | מטמיעים לפי מזהה (ID) |
| **תמונות** | `public/images/` | דחוסות, עד ~300KB |
| **CV (PDF)** | `public/cv/cv.pdf` | |
| **טקסטים** | `content/site.ts` | עברית + אנגלית |
| **גיבוי מקורות גולמיים** | Google Drive | לא מחובר לאתר |

---

## איך מוסיפים/מעדכנים תוכן

כל התוכן יושב בתיקיית `content/`. כל טקסט הוא דו-לשוני: `{ he: "...", en: "..." }`.

### 1. פרטים אישיים, אודות, צור קשר — `content/site.ts`
החלף את כל מה שמסומן ב-`TODO`:
- `profile.name` — השם שלך
- `contact.email`, `contact.phone` — פרטי קשר
- `contact.socials` — לינקים (אינסטגרם וכו'); השאר `url: ""` כדי להסתיר לינק
- `showreel.vimeoId` — מזהה ה-Showreel (השאר `""` והסקשן יוסתר)

### 2. וידאו — `content/videos.ts`
לכל סרטון יש שדה `vimeoId`. כדי למצוא אותו:
1. העלה את הסרטון ל-Vimeo.
2. הכתובת תיראה כך: `https://vimeo.com/123456789` → המזהה הוא `123456789`.
3. אם הסרטון מסומן כ-Unlisted עם hash (למשל `vimeo.com/123456789/abc123`) — הכנס את `abc123` בשדה `vimeoHash`.
4. סרטון בלי `vimeoId` יוצג כ"בקרוב" עד שתוסיף מזהה.

הקטגוריות: `"stage"` (במה / תיאטרון) ו-`"camera"` (מול מצלמה).

### 3. תמונות — `content/photos.ts`
1. דחוס את התמונה (https://squoosh.app) ושמור עד ~300KB.
2. שים אותה ב-`public/images/` (למשל `headshot-1.jpg`).
3. הוסף שורה ב-`content/photos.ts` עם ה-`src` המתאים.
הקטגוריות: `"headshots"` (צילומים מקצועיים) ו-`"classes"` (מהשיעורים/הבמה).

### 4. CV
שים קובץ בשם `cv.pdf` בתוך `public/cv/`.

---

## העלאה לאוויר (Deploy) — חינם דרך Cloudflare Pages

האתר בנוי כ**אתר סטטי** (`output: "export"` ב-`next.config.ts`), כלומר `npm run build`
מייצר תיקיית `out/` עם HTML/CSS/JS + התמונות שלך. את זה מארחים בחינם ב-Cloudflare Pages
(דומיין חינמי `*.pages.dev`, ללא הגבלת תעבורה). הוידאו יושב ב-Vimeo ומוטמע בעמוד.

### שלב א' — GitHub
1. פתח חשבון ב-https://github.com (אם אין).
2. צור Repository חדש (פרטי או ציבורי).
3. מתוך תיקיית הפרויקט, חבר ודחוף את הקוד:

```bash
git add .
git commit -m "Initial actor portfolio"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

### שלב ב' — Cloudflare Pages (מומלץ: חיבור ל-GitHub)
1. פתח חשבון ב-https://dash.cloudflare.com (חינם).
2. **Workers & Pages → Create → Pages → Connect to Git** ובחר את ה-Repository.
3. הגדרות ה-build:
   - **Framework preset:** `Next.js (Static HTML Export)` (או `None`)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - (קובץ `.node-version` בפרויקט כבר קובע Node 22 עבור ה-build)
4. **Save and Deploy**. תוך דקה-שתיים האתר חי בכתובת `https://<project>.pages.dev`.

מעכשיו כל `git push` ל-`main` מפרסם את האתר אוטומטית.

### חלופה מהירה בלי GitHub — העלאה ישירה
```bash
npm run build
npx wrangler pages deploy out
```
(בפעם הראשונה `wrangler` יבקש להתחבר לחשבון Cloudflare.)

### דומיין אישי (אופציונלי, בהמשך)
ב-Cloudflare Pages: **Project → Custom domains → Set up a domain**. אחרי חיבור דומיין
משלך, זה מתחבר בכמה דקות (וכולל SSL חינם).

> הערה: אפשר גם לארח ב-Vercel בדיוק מאותו קוד (Static Export עובד בשני המקומות),
> אבל כאן ההנחיות ל-Cloudflare Pages כפי שביקשת.

---

## מבנה הפרויקט

```text
app/            # layout + עמוד ראשי + סגנונות גלובליים
components/     # Navbar, Hero, About, VideoGallery, PhotoGallery, Contact ...
content/        # כל התוכן (טקסטים, וידאו, תמונות) — כאן עורכים
lib/i18n.tsx    # מנגנון דו-לשוניות (עברית/אנגלית) + החלפת כיוון RTL/LTR
public/         # תמונות, CV, נכסים סטטיים
```

> הערה ארכיטקטונית: הדו-לשוניות מיושמת עם Context צד-לקוח קליל (החלפת שפה מיידית ללא ניווט),
> במקום `next-intl` עם ניתוב `[locale]` — פשוט יותר לתחזוקה לאתר עמוד-אחד וללא תלות ב-middleware.
