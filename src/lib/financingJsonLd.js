import { toPlainText } from 'next-sanity';
import { SITE_URL } from '@/data/site';
import { FINANCING_PAGES } from '@/data/financingPages';
import { absoluteUrl, breadcrumbTrail } from '@/lib/jsonLd';

function answerText(answer) {
  if (!answer) return '';
  if (typeof answer === 'string') return answer;
  return toPlainText(answer);
}

function faqEntities(page) {
  return (page.pageBuilder || [])
    .filter((block) => block._type === 'faqBlock' || block._type === 'dealerFaqFormBlock')
    .flatMap((block) => block.items || [])
    .map((item) => ({ question: item.question, text: answerText(item.answer) }))
    .filter((item) => item.question && item.text)
    .map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.text },
    }));
}

export function financingCrumbs(slug) {
  if (!FINANCING_PAGES[slug]) return null;
  return breadcrumbTrail(`/${slug}`)?.map((crumb) => ({ name: crumb.name, href: crumb.path })) ?? null;
}

// WebPage + BreadcrumbList + LoanOrCredit + FAQPage for the hub and brand pages.
// No rating, interest rate, term or amount fields.
export function financingJsonLd(slug, page) {
  const config = FINANCING_PAGES[slug];
  if (!config || !page) return null;

  const url = `${SITE_URL}/${slug}`;
  const name = page.seo?.title?.trim() || config.seoTitle;
  const description = page.seo?.description?.trim() || config.seoDescription;
  const image = page.pageBuilder?.find((block) => block.image?.asset?.url)?.image.asset.url || config.image;
  const faqs = faqEntities(page);

  const graph = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name,
      description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${url}#loan` },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      ...(image && { primaryImageOfPage: { '@type': 'ImageObject', url: image } }),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: (breadcrumbTrail(`/${slug}`) ?? []).map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })),
    },
    {
      '@type': 'LoanOrCredit',
      '@id': `${url}#loan`,
      name: config.loanName,
      url,
      provider: { '@id': `${SITE_URL}/#organization` },
      loanType: 'Auto loan',
      areaServed: { '@type': 'Country', name: 'US' },
      description,
      ...(config.category && { category: config.category }),
    },
  ];

  if (faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs,
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
