import PageBuilder from '@/components/page-builder';
import { getPage } from '@/lib/sanity';

export const metadata = {
  description: "Financing built by car people, for car people — the car you want, on a payment that makes sense. Fast, private, and fluent in the cars your bank won't touch.",
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    description: "Financing built by car people, for car people — the car you want, on a payment that makes sense. Fast, private, and fluent in the cars your bank won't touch.",
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
