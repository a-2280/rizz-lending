import { notFound } from 'next/navigation';
import { getBlogPost } from '@/lib/sanity';
import BlogPost from '@/components/blogPost';
import { sanityImage } from '@/lib/image';
import { SITE_URL } from '@/data/site';

export const revalidate = 60;

const SEO_TITLES = {
  'long-term-exotic-car-loans-up-to-20-years-how-they-work-risks-and-smart-alternatives': 'Long-Term Exotic Car Loans: How They Work | Rizz Lending',
  'porsche-911-turbo-s-financing-smart-strategies-to-own-an-icon-without-overpaying': 'Porsche 911 Turbo S Financing Guide | Rizz Lending',
  'dead-cars-new-opportunities': 'Dead Cars, New Opportunities in Auto Finance | Rizz Lending',
  'the-lamborghini-veneno-the-ultimate-dream-car-how-to-finance-one': 'Lamborghini Veneno Financing: How It Works | Rizz Lending',
  'navigating-the-impact-of-new-u-s-tariffs-on-exotic-car-brands': 'How New U.S. Tariffs Affect Exotic Car Brands | Rizz Lending',
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  const image = sanityImage(post.mainImage, 1200);
  return {
    title: SEO_TITLES[slug] ? { absolute: SEO_TITLES[slug] } : post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    ...(image && { openGraph: { siteName: 'Rizz Lending', type: 'article', locale: 'en_US', publishedTime: post.publishedAt, images: [image] } }),
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt ?? undefined,
        image: sanityImage(post.mainImage, 1200) ?? undefined,
        datePublished: post.publishedAt,
        dateModified: post._updatedAt,
        author: post.author ? { '@type': 'Person', name: post.author } : undefined,
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <BlogPost {...post} />
    </>
  );
}
