import { notFound } from 'next/navigation';
import { getPage } from '@/lib/sanity';
import PageBuilder from '@/components/page-builder';
import { sanityImage } from '@/lib/image';

export const revalidate = 60;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const page = await getPage(slugPath);
  if (!page) return {};
  const image = sanityImage(page.pageBuilder?.[0]?.image, 1200);
  return {
    title: page.title,
    alternates: { canonical: `/${slugPath}` },
    ...(image && { openGraph: { siteName: 'Rizz Lending', type: 'website', locale: 'en_US', images: [image] } }),
  };
}

export default async function CmsPage({ params }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const page = await getPage(slugPath);
  if (!page) notFound();
  return (
    <main>
      <PageBuilder blocks={page.pageBuilder} />
    </main>
  );
}
