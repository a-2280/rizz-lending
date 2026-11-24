import { SITE_URL, BREADCRUMBS } from '../data/site.js';

const absoluteUrl = (path) => (path === '/' ? SITE_URL : `${SITE_URL}${path}`);

export function siteJsonLd(socials) {
  const sameAs = (socials ?? []).map((social) => social.href).filter((href) => /^https?:\/\//i.test(href ?? ''));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FinancialService',
        '@id': `${SITE_URL}/#organization`,
        name: 'Rizz Lending',
        legalName: 'Rizz Lending LLC',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/logo.png`,
        telephone: '+1-801-880-9955',
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', telephone: '+1-801-880-9955' },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '13222 Tree Sparrow Dr., STE R-327',
          addressLocality: 'Riverton',
          addressRegion: 'UT',
          postalCode: '84096',
          addressCountry: 'US',
        },
        identifier: { '@type': 'PropertyValue', propertyID: 'NMLS', value: '2682279' },
        ...(sameAs.length > 0 && { sameAs }),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Rizz Lending',
        url: SITE_URL,
        inLanguage: 'en-US',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function breadcrumbJsonLd(path) {
  const trail = BREADCRUMBS[path];
  if (!trail) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, name: crumb.name, item: absoluteUrl(crumb.path) })),
  };
}
