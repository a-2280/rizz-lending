import { notFound } from 'next/navigation';
import { getPage } from '@/lib/sanity';
import PageBuilder from '@/components/page-builder';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const page = await getPage(slugPath);
  if (!page) return {};
  return {
    title: page.title,
    alternates: { canonical: `/${slugPath}` },
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
