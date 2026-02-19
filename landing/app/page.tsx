import LandingPage from "@/components/LandingPage";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LeetDaily - Daily LeetCode Challenge",
    applicationCategory: "BrowserApplication",
    operatingSystem: "Chrome",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Never miss a LeetCode Daily Challenge! Track Blind 75, NeetCode 150 & LC 75 progress, browse 2000+ problems, FAANG company tags, 30-day heatmap, streak milestones & smart reminders.",
    url: "https://leetdaily.masst.dev",
    installUrl:
      "https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf",
    browserRequirements: "Requires Chrome",
    softwareVersion: "2.0.0",
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
