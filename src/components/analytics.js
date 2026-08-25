import Script from 'next/script';
import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID, HUBSPOT_PORTAL_ID } from '@/lib/analytics';

// Third-party tags, rendered once from the root layout.
//
// Deliberately NOT a GTM container: the old WordPress site loaded one, but we're
// going direct with gtag. Loading both would double-count conversions.

export default function Analytics() {
  // Only configure GA4 when a measurement ID is actually present — an empty
  // gtag('config', '') is worse than no call at all.
  const gtagInit = ['window.dataLayer = window.dataLayer || [];', 'function gtag(){dataLayer.push(arguments);}', "gtag('js', new Date());", `gtag('config', '${GOOGLE_ADS_ID}');`, GA4_MEASUREMENT_ID ? `gtag('config', '${GA4_MEASUREMENT_ID}');` : ''].filter(Boolean).join('\n');

  return (
    <>
      {/* HubSpot tracking script — sets the hubspotutk cookie that ties form
          submissions to a visitor's browsing history. See getHutk(). */}
      <Script id="hs-script-loader" strategy="afterInteractive" async defer src={`https://js.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`} />

      {/* Google tag (Google Ads, plus GA4 when configured) */}
      <Script id="gtag-src" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} />
      <Script id="gtag-init" strategy="afterInteractive">
        {gtagInit}
      </Script>
    </>
  );
}
