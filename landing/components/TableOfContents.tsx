"use client";

import { useEffect, useState, useRef } from "react";
import GithubSlugger from "github-slugger";

interface TOCItem {
  text: string;
  slug: string;
}

function extractHeadings(content: string): TOCItem[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^## (.+)$/gm;
  const headings: TOCItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim();
    const slug = slugger.slug(text);
    headings.push({ text, slug });
  }
  return headings;
}

export default function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  const [activeSlug, setActiveSlug] = useState("");
  const [visible, setVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Track active heading on scroll
  useEffect(() => {
    const ids = headings.map((h) => h.slug);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav
      ref={navRef}
      className={`hidden xl:block sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-4"
      }`}
    >
      <h4 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">
        On this page
      </h4>
      <ul className="space-y-1 border-l border-white/10 pl-4">
        {headings.map((h, i) => {
          const isActive = activeSlug === h.slug;
          return (
            <li
              key={h.slug}
              style={{ transitionDelay: `${i * 50}ms` }}
              className={`transition-all duration-500 ${
                visible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-3"
              }`}
            >
              <a
                href={`#${h.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.slug)?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setActiveSlug(h.slug);
                }}
                className={`text-sm block py-1 transition-all duration-300 border-l-2 -ml-[17px] pl-[15px] ${
                  isActive
                    ? "text-orange-400 border-orange-400 font-medium"
                    : "text-white/40 border-transparent hover:text-white/70 hover:border-white/20"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
