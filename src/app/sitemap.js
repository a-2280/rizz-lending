import { SITE_URL, ROUTES } from "../data/site";

export default function sitemap() {
  return ROUTES.map(({ path }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
