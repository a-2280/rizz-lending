export function resolveHref(link) {
  if (!link) return null;
  if (link.linkType === 'external') return link.href || null;
  if (link.pageSlug) return link.pageSlug === 'home' ? '/' : `/${link.pageSlug}`;
  return link.href || null;
}
