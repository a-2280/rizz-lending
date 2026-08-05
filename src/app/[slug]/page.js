import { notFound } from 'next/navigation';
import { getPage } from '@/lib/sanity';
import PageBuilder from '@/components/page-builder';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    alternates: { canonical: `/${slug}` },
  };
}

export default async function CmsPage({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  return (
    <main>
      <PageBuilder blocks={page.pageBuilder} />
    </main>
  );
}
