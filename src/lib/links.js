export function resolveHref(link) {
  if (!link) return null;
  if (link.linkType === 'external') return link.href || null;
  if (link.pageSlug) return link.pageSlug === 'home' ? '/' : `/${link.pageSlug}`;
  return link.href || null;
}

const CONTACT_LINKS = {
  '801-880-9955': { href: 'tel:+18018809955' },
  'NMLS #2682279': { href: 'https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/2682279', target: '_blank', rel: 'noopener noreferrer' },
};

export function linkifyContact(text) {
  if (!text) return text;
  return text.split(/(801-880-9955|NMLS #2682279)/).map((part, i) => (CONTACT_LINKS[part] ? <a key={i} className="underline" {...CONTACT_LINKS[part]}>{part}</a> : part));
}
