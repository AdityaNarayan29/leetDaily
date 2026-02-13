import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  keywords: string[];
  image: string;
  readingTime: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllPosts(): BlogPostMeta[] {
  const slugs = getAllPostSlugs();
  return slugs
    .map((slug) => getPostMeta(slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostMeta(slug: string): BlogPostMeta {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author,
    tags: data.tags || [],
    keywords: data.keywords || [],
    image: data.image || "/og-image.png",
    readingTime: stats.text,
  };
}

export function getPost(slug: string): BlogPost {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author,
    tags: data.tags || [],
    keywords: data.keywords || [],
    image: data.image || "/og-image.png",
    readingTime: stats.text,
    content,
  };
}
