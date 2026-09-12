import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Daily Brief | 経営サマリー", description: "社員の日報をAIで整理する、社長向けの経営ダッシュボード" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
