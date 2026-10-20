import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "hebrew", "arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  // TODO: once deployed, set this to your live URL (e.g. https://<project>.pages.dev).
  metadataBase: new URL("https://ibrahimissa-actor.issavi.workers.dev"),
  title: {
    default: "Ibrahim Issa — Actor",
    template: "%s · Ibrahim Issa",
  },
  description:
    "Ibrahim Issa — actor and Technion-graduate software engineer. Stage and on-camera work, professional photos, and course reels.",
  keywords: [
    "Ibrahim Issa",
    "actor",
    "acting",
    "portfolio",
    "שחקן",
    "איברהים עיסא",
    "تمثيل",
    "إبراهيم عيسى",
  ],
  openGraph: {
    type: "website",
    title: "Ibrahim Issa — Actor",
    description:
      "Actor and Technion-graduate software engineer — stage and on-camera work, professional photos, and course reels.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full`}>
      <body className="min-h-full">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
