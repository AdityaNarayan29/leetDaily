import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://leetdaily.masst.dev"),
  title: "LeetDaily — LeetCode Interview Prep & Tracker",
  description:
    "Ace coding interviews with daily LeetCode challenges, Blind 75/NeetCode 150 tracking, FAANG company tags, 3800+ problems explorer, streaks & smart reminders.",
  keywords: [
    "LeetCode",
    "interview prep",
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
    "Striver SDE sheet",
    "Namaste DSA",
    "Fraz DSA",
    "DSA sheet",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://leetdaily.masst.dev",
  },
  openGraph: {
    title: "LeetDaily — LeetCode Interview Prep & Tracker",
    description:
      "Ace coding interviews with 6 DSA sheets (Blind 75, NeetCode 150, Striver SDE, Namaste DSA, Fraz DSA), 3800+ problems explorer, FAANG tags & streaks.",
    url: "https://leetdaily.masst.dev",
    type: "website",
    locale: "en_US",
    siteName: "LeetDaily",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeetDaily — LeetCode Interview Prep & Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeetDaily — LeetCode Interview Prep & Tracker",
    description:
      "Ace coding interviews with LeetCode. Blind 75, NeetCode 150, 3800+ problems, FAANG tags, streaks & smart reminders.",
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
