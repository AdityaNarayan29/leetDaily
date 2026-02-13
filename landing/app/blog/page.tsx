import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export const metadata: Metadata = {
  title: "Blog — LeetDaily | LeetCode Tips, Extensions & Interview Prep",
  description:
    "Articles about LeetCode Chrome extensions, coding interview strategies, and developer productivity tools.",
  keywords: [
    "leetcode blog",
    "leetcode tips",
    "leetcode chrome extensions",
    "coding interview prep",
  ],
  alternates: {
    canonical: "https://leetdaily.masst.dev/blog",
  },
  openGraph: {
    title: "Blog — LeetDaily",
    description:
      "Articles about LeetCode Chrome extensions, coding interview strategies, and developer productivity tools.",
    url: "https://leetdaily.masst.dev/blog",
    type: "website",
    siteName: "LeetDaily",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-red-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-1000" />
      </div>

      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollFadeIn>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-white/50 mb-12">
              LeetCode tips, Chrome extensions, and coding interview insights.
            </p>
          </ScrollFadeIn>

          <div className="space-y-6">
            {posts.map((post) => (
              <ScrollFadeIn key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <article className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] bg-orange-500/10 text-orange-300 border border-orange-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-orange-400 group-hover:translate-x-1 transition-all ml-auto" />
                  </div>
                </article>
              </Link>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
