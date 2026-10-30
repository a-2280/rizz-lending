import PageBuilder from '@/components/page-builder';
import { getPage } from '@/lib/sanity';

export const revalidate = 60;

export const metadata = {
  title: { absolute: 'Exotic Car Financing & Supercar Loans | Rizz Lending' },
  description: "Exotic car financing from car people. Supercar and luxury car loans up to $1M+, with fast, private decisions on the cars your bank won't touch.",
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    description: "Exotic car financing from car people. Supercar and luxury car loans up to $1M+, with fast, private decisions on the cars your bank won't touch.",
  },
};

export default async function HomePage() {
  const page = await getPage('home');
  return (
    <main>
      <PageBuilder blocks={page?.pageBuilder} />
    </main>
  );
}
