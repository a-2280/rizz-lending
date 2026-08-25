// Google Ads / GA4 / HubSpot tracking helpers.
//
// The tags themselves are rendered by src/components/analytics.js; this module
// holds the IDs and the two functions that read from / write to them at runtime.

// Fallbacks match the values pulled from the old site's GTM container, so the
// site keeps tracking even if .env.local is missing (matches the process.env.X ?? '…'
// pattern used in src/data/site.js and src/app/layout.js).
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? 'AW-18207288575';
export const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL ?? 'a38uCILvwMgcEP_Z9OlD';
export const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ?? '47162564';

// No fallback: absent means there is no GA4 property, and we emit nothing.
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '';

/**
 * Read the `hubspotutk` cookie set by HubSpot's tracking script.
 *
 * This is what links a form submission to that visitor's browsing history in the
 * CRM — without it every contact looks like it appeared from nowhere. The cookie
 * is not httpOnly-readable server-side, so it has to be picked up in the browser
 * and passed through to the route handler.
 *
 * Returns undefined server-side, or when the tracking script hasn't set it yet
 * (first paint, ad blocker).
 */
export function getHutk() {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Fire the single Google Ads conversion action. All forms feed this one action,
 * mirroring the old site (which triggered it off a /thank-you/ page path).
 *
 * Callers must only invoke this after HubSpot has confirmed the submission —
 * not on click, not on validation pass. Guarding against double-fires is the
 * caller's job; see useHubspotForm.
 *
 * Never throws: gtag is absent behind ad blockers and before the script loads,
 * and a missed conversion must never break the submission for the user.
 * Returns true if the event was actually handed to gtag.
 */
export function fireConversion() {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
    window.gtag('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}` });
    return true;
  } catch {
    return false;
  }
}
