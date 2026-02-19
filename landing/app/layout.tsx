import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://leetdaily.masst.dev"),
  title: "LeetDaily - Daily LeetCode Challenge, Blind 75 & NeetCode 150 Tracker",
  description:
    "Free Chrome extension for LeetCode daily challenges. Track Blind 75, NeetCode 150 & LC 75 progress, browse 2000+ problems, FAANG company tags, 30-day heatmap, streak milestones & smart reminders.",
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
    "Blind 75",
    "NeetCode 150",
    "LeetCode 75",
    "problems explorer",
    "study lists",
    "streak milestones",
    "LeetCode tracker",
    "coding interview prep",
  ],
  alternates: {
    canonical: "https://leetdaily.masst.dev",
  },
  openGraph: {
    title: "LeetDaily - Daily LeetCode Challenge, Blind 75 & NeetCode 150 Tracker",
    description:
      "Free Chrome extension for LeetCode daily challenges. Blind 75, NeetCode 150, 2000+ problems explorer, FAANG company tags, streak milestones & smart reminders.",
    url: "https://leetdaily.masst.dev",
    type: "website",
    locale: "en_US",
    siteName: "LeetDaily",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeetDaily - Daily LeetCode Challenge, Blind 75 & NeetCode 150 Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeetDaily - Daily LeetCode Challenge, Blind 75 & NeetCode 150 Tracker",
    description:
      "Free Chrome extension for LeetCode daily challenges. Blind 75, NeetCode 150, 2000+ problems, FAANG tags, streak milestones & smart reminders.",
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
