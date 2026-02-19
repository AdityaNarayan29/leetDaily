import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import UninstallFeedback from "@/components/UninstallFeedback";

export const metadata: Metadata = {
  title: "We're sorry to see you go — LeetDaily",
  description: "Help us improve LeetDaily by sharing your feedback.",
  robots: { index: false, follow: false },
};

export default function UninstallPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-red-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-1000" />
      </div>

      <Navbar />

      <main className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-5xl mb-6">👋</div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            We&apos;re sorry to see you go
          </h1>
          <p className="text-white/50 mb-10 text-sm sm:text-base">
            Your feedback helps us make LeetDaily better. What made you
            uninstall?
          </p>

          <UninstallFeedback />
        </div>
      </main>
    </div>
  );
}
