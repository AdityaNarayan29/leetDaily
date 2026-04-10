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
      "Ace coding interviews with daily LeetCode challenges, Blind 75/NeetCode 150 tracking, FAANG company tags, 2000+ problems explorer, streaks & smart reminders.",
    url: "https://leetdaily.masst.dev",
    installUrl:
      "https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf",
    browserRequirements: "Requires Chrome",
    softwareVersion: "2.4.0",
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
