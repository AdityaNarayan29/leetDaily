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
      "Never miss a LeetCode Daily Challenge! Track streaks, company tags, profile sync, 30-day heatmap & smart notifications.",
    url: "https://leetdaily.masst.dev",
    installUrl:
      "https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf",
    browserRequirements: "Requires Chrome",
    softwareVersion: "1.2.1.1",
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
