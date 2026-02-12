import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://leetdaily.masst.dev"),
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
  alternates: {
    canonical: "https://leetdaily.masst.dev",
  },
  openGraph: {
    title: "LeetDaily - Daily LeetCode Challenge Reminder & Streak Tracker",
    description:
      "Never miss a LeetCode Daily Challenge! Track streaks, company tags, 30-day heatmap & smart notifications. Free Chrome extension.",
    url: "https://leetdaily.masst.dev",
    type: "website",
    locale: "en_US",
    siteName: "LeetDaily",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeetDaily - Daily LeetCode Challenge Reminder & Streak Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeetDaily - Daily LeetCode Challenge Reminder & Streak Tracker",
    description:
      "Never miss a LeetCode Daily Challenge! Track streaks, company tags, 30-day heatmap & smart notifications.",
    images: ["/og-image.png"],
    creator: "@Adityanaraynn29",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
