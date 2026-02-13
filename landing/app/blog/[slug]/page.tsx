import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { compile, run } from "@mdx-js/mdx";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getPost, getAllPostSlugs } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx-components";
import TableOfContents from "@/components/TableOfContents";
import Navbar from "@/components/Navbar";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let post;
  try {
    post = getPost(slug);
  } catch {
    return {};
  }

  return {
    title: `${post.title} — LeetDaily Blog`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `https://leetdaily.masst.dev/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://leetdaily.masst.dev/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      siteName: "LeetDaily",
      images: [
        {
          url: `/blog/og/${slug}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`/blog/og/${slug}`],
    },
  };
}

async function renderMDX(source: string) {
  const code = String(
    await compile(source, {
      outputFormat: "function-body",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    })
  );
  const { default: MDXContent } = await run(code, {
    Fragment,
    jsx,
    jsxs,
    baseUrl: import.meta.url,
  });
  return MDXContent;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

  const MDXContent = await renderMDX(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://adityanarayan.co.in/",
    },
    publisher: {
      "@type": "Organization",
      name: "LeetDaily",
      url: "https://leetdaily.masst.dev",
    },
    image: `https://leetdaily.masst.dev/blog/og/${slug}`,
    url: `https://leetdaily.masst.dev/blog/${slug}`,
    mainEntityOfPage: `https://leetdaily.masst.dev/blog/${slug}`,
    keywords: post.keywords.join(", "),
    wordCount: post.content.split(/\s+/).length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-red-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-1000" />
        </div>

        <Navbar />

        <main className="pt-24 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-orange-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="grid xl:grid-cols-[1fr_250px] gap-6 sm:gap-12">
              <article className="max-w-3xl">
                <ScrollFadeIn>
                <header className="mb-10">
                  <div className="flex items-center gap-3 text-sm text-white/40 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {post.readingTime}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                    {post.title}
                  </h1>

                  <p className="text-lg text-white/50 leading-relaxed">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-orange-500/10 text-orange-300 border border-orange-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </header>
                </ScrollFadeIn>

                <hr className="border-white/10 mb-10" />

                <div>
                  <MDXContent components={mdxComponents} />
                </div>
              </article>

              <TableOfContents content={post.content} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
