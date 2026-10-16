import { SITE_URL, ROUTES } from "../data/site";
import { getBlogPosts, getPageDates } from "@/lib/sanity";

// For routes with no Sanity document (/apply). Bump it when that page changes.
const STATIC_LASTMOD = "2026-10-15";

export default async function sitemap() {
  const posts = (await getBlogPosts()) ?? [];
  const pages = (await getPageDates()) ?? [];
  const updatedAt = Object.fromEntries(pages.map((page) => [page.slug, page._updatedAt]));

  return [
    ...ROUTES.map(({ path }) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified: new Date(updatedAt[path === "/" ? "home" : path.slice(1)] ?? STATIC_LASTMOD),
      changeFrequency: "monthly",
      priority: path === "/" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: "yearly",
      priority: 0.5,
    })),
  ];
}
