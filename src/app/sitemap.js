import { SITE_URL, ROUTES } from "../data/site";
import { getBlogPosts } from "@/lib/sanity";

export default async function sitemap() {
  const posts = (await getBlogPosts()) ?? [];

  return [
    ...ROUTES.map(({ path }) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: path === "/" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: "yearly",
      priority: 0.5,
    })),
  ];
}
