import '../scss/site.scss';
import { clash, gambetta, archivo } from '../fonts';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { getFooter } from '@/lib/sanity';
import SmoothScroll from '@/components/smoothScroll';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.rizzlending.com'),
  title: {
    default: 'Rizz Lending — More car. Less monthly.',
    template: '%s | Rizz Lending',
  },
  description: "Exotic, luxury & collector car financing built by car people, for car people. Fast, private approvals on the cars your bank won't touch.",
  openGraph: {
    siteName: 'Rizz Lending',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport = {
  themeColor: '#0E0E0E',
};

export default async function RootLayout({ children }) {
  const footer = await getFooter();
  return (
    <SmoothScroll>
      <html lang="en" className={`${clash.variable} ${gambetta.variable} ${archivo.variable}`}>
        <body>
          <Header />
          {children}
          <Footer {...footer} />
        </body>
      </html>
    </SmoothScroll>
  );
}
