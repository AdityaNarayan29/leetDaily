import type { MDXComponents } from "mdx/types";
import ScrollFadeIn from "./ScrollFadeIn";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <ScrollFadeIn>
      <h1
        className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-8 sm:mt-10 mb-4 text-white"
        {...props}
      />
    </ScrollFadeIn>
  ),
  h2: (props) => (
    <ScrollFadeIn>
      <h2
        className="text-xl sm:text-2xl lg:text-3xl font-bold mt-8 sm:mt-10 mb-3 text-white scroll-mt-24"
        {...props}
      />
    </ScrollFadeIn>
  ),
  h3: (props) => (
    <ScrollFadeIn>
      <h3
        className="text-xl font-semibold mt-8 mb-2 text-white/90"
        {...props}
      />
    </ScrollFadeIn>
  ),
  p: (props) => (
    <p className="text-white/70 leading-relaxed mb-4" {...props} />
  ),
  a: (props) => (
    <a
      className="text-orange-400 hover:text-orange-300 underline underline-offset-4 transition-colors"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="list-disc list-inside space-y-2 mb-4 text-white/70"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-inside space-y-2 mb-4 text-white/70"
      {...props}
    />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <ScrollFadeIn>
      <blockquote
        className="border-l-4 border-orange-500 pl-4 py-2 my-4 bg-white/5 rounded-r-lg text-white/60 italic"
        {...props}
      />
    </ScrollFadeIn>
  ),
  code: (props) => (
    <code
      className="bg-white/10 rounded px-1.5 py-0.5 text-sm text-orange-300 font-mono"
      {...props}
    />
  ),
  pre: (props) => (
    <ScrollFadeIn>
      <pre
        className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 overflow-x-auto mb-4 text-sm"
        {...props}
      />
    </ScrollFadeIn>
  ),
  table: (props) => (
    <ScrollFadeIn>
      <div className="overflow-x-auto mb-6 rounded-xl border border-white/10">
        <table
          className="w-full text-sm text-left border-collapse"
          {...props}
        />
      </div>
    </ScrollFadeIn>
  ),
  th: (props) => (
    <th
      className="border-b border-white/10 bg-white/5 px-2 sm:px-4 py-2 sm:py-3 text-white font-semibold text-xs sm:text-sm"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-b border-white/5 px-2 sm:px-4 py-2 sm:py-3 text-white/70 text-xs sm:text-sm"
      {...props}
    />
  ),
  hr: () => <hr className="border-white/10 my-8" />,
  img: (props) => (
    <ScrollFadeIn>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="rounded-xl border border-white/10 my-6 max-w-full h-auto"
        alt={props.alt || ""}
        {...props}
      />
    </ScrollFadeIn>
  ),
  strong: (props) => (
    <strong className="text-white font-semibold" {...props} />
  ),
};
