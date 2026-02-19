"use client";

import { useState } from "react";
import { Flame } from "lucide-react";

const reasons = [
  { id: "not-working", label: "It didn't work properly", icon: "🐛" },
  { id: "better-alternative", label: "Found a better alternative", icon: "🔄" },
  { id: "not-useful", label: "Not useful for me", icon: "🤷" },
  { id: "missing-features", label: "Missing features I need", icon: "🧩" },
  { id: "too-complicated", label: "Too complicated to use", icon: "😵" },
  { id: "performance", label: "Slowed down my browser", icon: "🐢" },
  { id: "permissions", label: "Too many permissions", icon: "🔒" },
  { id: "temporary", label: "Just testing / temporary", icon: "⏱️" },
];

export default function UninstallFeedback() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [otherText, setOtherText] = useState("");

  function handleSelect(id: string) {
    setSelected(id);
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-12 animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
          <Flame className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold mb-3">Thank you for your feedback!</h2>
        <p className="text-white/50 text-sm mb-8">
          We&apos;ll use this to make LeetDaily better.
        </p>
        <a
          href="https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Give us another chance?
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {reasons.map((reason) => (
          <button
            key={reason.id}
            onClick={() => handleSelect(reason.id)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-sm transition-all duration-200 cursor-pointer ${
              selected === reason.id
                ? "border-orange-500/60 bg-orange-500/10 text-white"
                : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.04]"
            }`}
          >
            <span className="text-lg flex-shrink-0">{reason.icon}</span>
            <span>{reason.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <textarea
          value={otherText}
          onChange={(e) => setOtherText(e.target.value)}
          placeholder="Anything else you'd like to share? (optional)"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-orange-500/40 resize-none transition-colors"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected}
        className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
          selected
            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 cursor-pointer"
            : "bg-white/10 text-white/30 cursor-not-allowed"
        }`}
      >
        Submit Feedback
      </button>
    </div>
  );
}
