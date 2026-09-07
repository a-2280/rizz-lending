// Ad-click attribution helpers.
//
// The loan application lives on application.rizzlending.com, a different origin
// from this site. Google Ads can only credit a conversion to the ad that caused
// it if the click ID (`gclid`) reaches whatever system records that conversion,
// so it has to be forwarded across that hop by hand.
//
// We talk to Google Ads through gtag directly rather than through the client's
// GTM container. The container's conversion tag is triggered by "page path
// contains /thank-you/" — with a trailing slash, which Next never serves — so it
// could not fire here, and nobody on our side has GTM access to retarget it.
// gtag('config') also does the conversion linking the container's Conversion
// Linker tag did, so nothing is lost by leaving it out.
//
// If the container is ever added back, delete one of the two conversion sources
// or the same submission gets counted twice.

export function readCookie(name) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * The current visitor's Google Ads click ID, or undefined.
 *
 * Reads the URL first (the landing page of an ad click), then falls back to the
 * `_gcl_aw` cookie that gtag('config') writes — which is what keeps the ID
 * available after the visitor has navigated away from the landing page. That
 * cookie's value is `GCL.<timestamp>.<gclid>`.
 */
export function getGclid() {
  if (typeof window === 'undefined') return undefined;

  const fromUrl = new URLSearchParams(window.location.search).get('gclid');
  if (fromUrl) return fromUrl;

  const cookie = readCookie('_gcl_aw');
  if (!cookie) return undefined;
  const parts = cookie.split('.');
  return parts.length > 2 ? parts.slice(2).join('.') : undefined;
}

/** Add the click ID to an outbound URL, leaving it untouched when there isn't one. */
export function withGclid(href) {
  const gclid = getGclid();
  if (!gclid) return href;
  try {
    const url = new URL(href);
    url.searchParams.set('gclid', gclid);
    return url.toString();
  } catch {
    return href;
  }
}

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
export const CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

/** Hand an event to gtag. No-ops when it's absent (not configured, ad blocker, still loading). */
export function trackEvent(event, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
  window.gtag('event', event, params);
  return true;
}

/**
 * Record the Google Ads conversion for a completed application.
 *
 * Only call this once the application is actually finished — not on click, not
 * on validation. Never throws: a missed conversion is a reporting problem, but
 * an exception here would break the page the customer is looking at.
 */
export function fireConversion() {
  if (!GOOGLE_ADS_ID || !CONVERSION_LABEL) return false;
  return trackEvent('conversion', { send_to: `${GOOGLE_ADS_ID}/${CONVERSION_LABEL}` });
}
