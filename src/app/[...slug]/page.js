import { notFound } from 'next/navigation';
import { getPage } from '@/lib/sanity';
import PageBuilder from '@/components/page-builder';
import { sanityImage } from '@/lib/image';

export const revalidate = 60;

const SEO = {
  overview: { title: 'Exotic Car Loans: Why Financing Beats Paying Cash | Rizz', description: 'Exotic car loans that keep your cash working. See how financing a supercar or luxury car compares with paying cash, then check your options.' },
  'cash-out-refinance': { title: 'Cash-Out Auto Refinance for Exotic & Luxury Cars | Rizz', description: "Cash-out auto refinance for exotic and luxury car owners. Turn your supercar's equity into cash without selling it. Private, fast and run by car people." },
  'lease-buyout': { title: 'Exotic Car Lease Buyout Loans | Rizz Lending', description: 'Lease buyout loans for exotic and luxury cars. Keep the supercar you already drive and finance the buyout with a lender who knows it. Fast and private.' },
  vehicles: { title: 'Supercar Financing: The Makes We Finance | Rizz Lending', description: 'Supercar financing for Ferrari, Lamborghini, Porsche, McLaren and more. See the exotic and luxury cars Rizz Lending finances, then check your eligibility.' },
  hypercar: { title: 'Hypercar Financing for Seven-Figure Cars | Rizz Lending', description: 'Hypercar financing for Bugatti, Pagani, Koenigsegg and other seven-figure cars. Discreet, direct exotic car loans from people who understand the asset.' },
  eligibility: { title: 'Exotic Car Financing Requirements | Rizz Lending', description: 'What affects exotic car financing rates and approval: your credit, your down payment and the car. See if you qualify for a supercar or luxury car loan.' },
  dealers: { title: 'Exotic Car Dealer Financing Partner Program | Rizz Lending', description: 'Dealer financing for exotic and luxury car inventory. Partner with Rizz Lending to give buyers fast, private supercar financing and close more deals.' },
  partners: { title: 'Auction & Marketplace Car Financing Partners | Rizz Lending', description: 'Pre-approved financing for buyers on car auction and marketplace platforms. Partner with Rizz Lending so bidders can finance exotic and luxury cars fast.' },
  about: { title: 'About Rizz Lending: Exotic Car Lenders Who Drive Them', description: 'Rizz Lending is an exotic car lender built by people who drive supercars. Meet the team behind private, fast luxury and exotic car loans from Utah.' },
  'check-availability': { title: 'Where We Lend: Exotic Car Financing by State | Rizz Lending', description: 'Now financing in 42 states. Check where Rizz Lending offers exotic and luxury car financing today, and see which states are coming next.' },
  careers: { title: 'Careers at Rizz Lending | Exotic Car Finance Jobs, Utah', description: 'Join Rizz Lending and build the exotic car financing brand car people trust. See open roles on our team in Riverton, Utah, and apply to work with us today.' },
  contact: { title: 'Contact Rizz Lending | Exotic Car Financing', description: 'Contact Rizz Lending about exotic or luxury car financing. Call 801-880-9955 to talk with our team of car people. NMLS #2682279.' },
  blog: { title: 'Exotic & Luxury Car Financing Guides | Rizz Lending Blog', description: 'Guides to luxury car financing, exotic car loans and supercar ownership: buying tips, model spotlights and how to finance your next car with confidence.' },
  licenses: { title: 'Licenses & Disclosures | Rizz Lending, NMLS #2682279', description: 'Rizz Lending, LLC (NMLS #2682279) state licenses and registrations, plus regulator contact details and disclosures for borrowers in the states we serve.' },
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const page = await getPage(slugPath);
  if (!page) return {};
  const image = sanityImage(page.pageBuilder?.[0]?.image, 1200);
  const seo = SEO[slugPath];
  return {
    title: seo ? { absolute: seo.title } : page.title,
    ...(seo && { description: seo.description }),
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
