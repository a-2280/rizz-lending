import '../scss/site.scss';
import Script from 'next/script';
import { clash, gambetta, archivo } from '../fonts';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { getFooter } from '@/lib/sanity';
import SmoothScroll from '@/components/smoothScroll';
import SalInit from '@/components/salInit';

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

// HubSpot's tracking script is per-account and per-region, same as the Forms
// API host in src/app/api/hubspot/route.js — na1 uses the bare host, other
// hublets prefix it. Both values come from the form's embed code.
const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const HUBSPOT_REGION = process.env.NEXT_PUBLIC_HUBSPOT_REGION?.trim() || 'na1';
const HUBSPOT_SCRIPT_HOST = HUBSPOT_REGION === 'na1' ? 'js.hs-scripts.com' : `js-${HUBSPOT_REGION}.hs-scripts.com`;

export default async function RootLayout({ children }) {
  const footer = await getFooter();
  return (
    <SmoothScroll>
      <html lang="en" className={`${clash.variable} ${gambetta.variable} ${archivo.variable}`}>
        <body>
          <SalInit />
          {/* HubSpot tracking script. Its only job here is setting the `hubspotutk`
              cookie, which the forms read and pass to /api/hubspot so HubSpot can
              tie a submission to that visitor's browsing history. Skipped entirely
              when no portal is configured, rather than loading a bogus URL. */}
          {HUBSPOT_PORTAL_ID && <Script id="hs-script-loader" src={`https://${HUBSPOT_SCRIPT_HOST}/${HUBSPOT_PORTAL_ID}.js`} strategy="afterInteractive" async defer />}
          <Header />
          {children}
          <Footer {...footer} />
        </body>
      </html>
    </SmoothScroll>
  );
}
