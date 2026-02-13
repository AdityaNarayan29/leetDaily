import Link from "next/link";
import { Flame, Chrome } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">LeetDaily</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Blog
          </Link>
          <a
            href="https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium transition-all duration-300 text-white"
          >
            <Chrome className="w-4 h-4" />
            Add to Chrome
          </a>
        </div>
      </div>
    </nav>
  );
}
