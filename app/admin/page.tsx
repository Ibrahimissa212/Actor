import type { Metadata } from "next";
import { Backoffice } from "@/components/Backoffice";
export const metadata: Metadata = {
  title: "Portfolio Backoffice",
  robots: { index: false, follow: false },
};
export default function AdminPage() {
  return <Backoffice />;
}
