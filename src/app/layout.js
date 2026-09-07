import '../scss/site.scss';
import Script from 'next/script';
import { clash, gambetta, archivo } from '../fonts';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { getFooter } from '@/lib/sanity';
import SmoothScroll from '@/components/smoothScroll';
import SalInit from '@/components/salInit';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rizzlending.com'),
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
  // Carried over from the old WordPress site. If the Search Console property is
  // verified by HTML tag rather than DNS, dropping this revokes the client's
  // access to it — so it stays until someone confirms DNS verification.
  verification: {
    google: '1VKd_1SCO54uhRHSA1yXRJ9zgprDR2KR3Th1QCylpKM',
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

// Google Ads, loaded directly rather than through the client's GTM container —
// see the note in src/lib/tracking.js for why. `config` here is what sets the
// _gcl_* cookies that carry the ad click ID to application.rizzlending.com; the
// conversion itself is fired from src/app/thank-you/page.js.
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export default async function RootLayout({ children }) {
  const footer = await getFooter();
  return (
    <SmoothScroll>
      <html lang="en" className={`${clash.variable} ${gambetta.variable} ${archivo.variable}`}>
        <body>
          <SalInit />
          {GOOGLE_ADS_ID && (
            <>
              <Script id="gtag-loader" src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="afterInteractive" />
              <Script id="gtag-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`}</Script>
            </>
          )}
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
