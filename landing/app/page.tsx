import LandingPage from "@/components/LandingPage";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LeetDaily — LeetCode Interview Prep & Tracker",
    applicationCategory: "BrowserApplication",
    operatingSystem: "Chrome",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Ace coding interviews with 6 curated DSA sheets (Blind 75, NeetCode 150, Striver SDE, Namaste DSA, Fraz DSA, LeetCode 75), FAANG company tags, 3800+ problems explorer, streaks & smart reminders.",
    url: "https://leetdaily.masst.dev",
    installUrl:
      "https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf",
    downloadUrl:
      "https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf",
    browserRequirements: "Requires Chrome 117+",
    softwareVersion: "2.4.0",
    datePublished: "2025-07-04",
    dateModified: "2026-04-28",
    featureList: "6 curated DSA sheets, dual streak tracking, 3800+ problems explorer, FAANG company tags, 30-day heatmap, smart reminders, cross-device sync, light/dark theme",
    author: {
      "@type": "Person",
      name: "Aditya Narayan",
      url: "https://adityanarayan.co.in/",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
