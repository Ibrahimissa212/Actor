import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "hebrew"],
  display: "swap",
});

export const metadata: Metadata = {
  // TODO: once deployed, set this to your live URL (e.g. https://<project>.pages.dev).
  metadataBase: new URL("https://your-name.pages.dev"),
  title: {
    default: "Actor Portfolio",
    template: "%s · Actor Portfolio",
  },
  description:
    "Acting portfolio — stage and on-camera work, headshots, and showreel.",
  keywords: ["actor", "acting", "showreel", "portfolio", "שחקן", "תיק עבודות"],
  openGraph: {
    type: "website",
    title: "Actor Portfolio",
    description:
      "Acting portfolio — stage and on-camera work, headshots, and showreel.",
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
