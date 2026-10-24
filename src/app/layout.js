import '../scss/site.scss';
import Script from 'next/script';
import { clash, gambetta, archivo } from '../fonts';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { getFooter } from '@/lib/sanity';
import SmoothScroll from '@/components/smoothScroll';
import SalInit from '@/components/salInit';
import UtmCapture from '@/components/utmCapture';
import MetaPixel from '@/components/metaPixel';
import { SITE_URL } from '@/data/site';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rizzlending.com'),
  title: {
    default: 'Rizz Lending | More car. Less monthly.',
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
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Google Consent Mode v2, Advanced mode, driven by the HubSpot cookie banner.
// The banner is an opt-out notice for US visitors, so everything defaults to
// granted; HubSpot's consent listener fires on every page load with the saved
// choice (and again whenever it changes) and downgrades to denied on opt-out.
// Advanced mode means gtag.js always loads — never gate it on consent — so
// denied visitors still send cookieless pings. wait_for_update holds the first
// hits briefly so a returning opted-out visitor is denied before anything fires.
// The same listener revokes the Meta Pixel; __adConsentDenied covers the case
// where HubSpot answers before the Pixel has loaded (see the Pixel snippet).
const CONSENT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',wait_for_update:500});var _hsp=window._hsp=window._hsp||[];_hsp.push(['addPrivacyConsentListener',function(c){var cat=c.categories||{};var a=c.allowed||cat.analytics?'granted':'denied';var ad=c.allowed||cat.advertisement?'granted':'denied';gtag('consent','update',{analytics_storage:a,ad_storage:ad,ad_user_data:ad,ad_personalization:ad});window.__adConsentDenied=ad==='denied';if(typeof window.fbq==='function')window.fbq('consent',ad==='denied'?'revoke':'grant');}]);`;

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FinancialService',
      '@id': `${SITE_URL}/#organization`,
      name: 'Rizz Lending',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/logo.png`,
      telephone: '+1-801-880-9955',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '13222 Tree Sparrow Dr., Suite R-327',
        addressLocality: 'Riverton',
        addressRegion: 'UT',
        postalCode: '84096',
        addressCountry: 'US',
      },
      identifier: { '@type': 'PropertyValue', propertyID: 'NMLS', value: '2682279' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Rizz Lending',
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export default async function RootLayout({ children }) {
  const footer = await getFooter();
  return (
    <SmoothScroll>
      <html lang="en" className={`${clash.variable} ${gambetta.variable} ${archivo.variable}`}>
        <body>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, '\\u003c') }} />
          <SalInit />
          <UtmCapture />
          <Script id="consent-default" strategy="beforeInteractive">{CONSENT_SCRIPT}</Script>
          {GOOGLE_ADS_ID && (
            <>
              <Script id="gtag-loader" src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="afterInteractive" />
              <Script id="gtag-init" strategy="afterInteractive">{`gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');${GA4_ID ? `gtag('config','${GA4_ID}');` : ''}`}</Script>
            </>
          )}
          {/* HubSpot tracking script. It sets the `hubspotutk` cookie, which the
              forms read and pass to /api/hubspot so HubSpot can tie a submission to
              that visitor's browsing history, and it serves the cookie banner whose
              choice feeds CONSENT_SCRIPT above. afterInteractive (not lazyOnload) so
              the consent listener answers inside gtag's wait_for_update window.
              Skipped entirely when no portal is configured, rather than loading a
              bogus URL. */}
          {HUBSPOT_PORTAL_ID && <Script id="hs-script-loader" src={`https://${HUBSPOT_SCRIPT_HOST}/${HUBSPOT_PORTAL_ID}.js`} strategy="afterInteractive" async defer />}
          {META_PIXEL_ID && (
            <>
              <Script id="meta-pixel" strategy="lazyOnload">{`if(window.self===window.top){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');if(window.__adConsentDenied)fbq('consent','revoke');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');}`}</Script>
              <MetaPixel />
            </>
          )}
          <Header />
          {children}
          <Footer {...footer} />
        </body>
      </html>
    </SmoothScroll>
  );
}
