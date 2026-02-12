import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeetDaily - Daily LeetCode Challenge Reminder & Streak Tracker",
  description:
    "Never miss a LeetCode Daily Challenge! Track streaks, company tags, profile sync, 30-day heatmap & smart notifications. Free Chrome extension for developers preparing for coding interviews.",
  keywords: [
    "LeetCode",
    "daily challenge",
    "streak tracker",
    "coding interview",
    "Chrome extension",
    "LeetCode streak",
    "company tags",
    "FAANG interview prep",
    "coding practice",
    "heatmap",
  ],
  openGraph: {
    title: "LeetDaily - Daily LeetCode Challenge Reminder & Streak Tracker",
    description:
      "Never miss a LeetCode Daily Challenge! Track streaks, company tags, 30-day heatmap & smart notifications. Free Chrome extension.",
    type: "website",
    locale: "en_US",
    siteName: "LeetDaily",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeetDaily - Daily LeetCode Challenge Reminder & Streak Tracker",
    description:
      "Never miss a LeetCode Daily Challenge! Track streaks, company tags, 30-day heatmap & smart notifications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
