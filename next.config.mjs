// Pages that existed on the old WordPress site, mapped to their closest match
// here. These URLs are indexed by Google and used as final URLs by live ads, so
// they have to keep resolving. Trailing slashes need no entry — Next normalises
// `/dealers/` to `/dealers` on its own.
//
// `/thank-you/` is deliberately absent — it is a real page again
// (src/app/thank-you/page.js), which is what lets the existing Google Ads
// conversion keep firing untouched. Redirecting it would silently kill that.
const LEGACY_PAGES = {
  '/loan-application': '/apply-now',
  '/quick-quote': '/apply-now',
  '/loan-services/calculator': '/apply-now',
  '/loan-services': '/overview',
  '/loan-services/exotic': '/hypercar',
  '/loan-services/collector': '/vehicles',
  '/vehicle-we-finance': '/vehicles',
  '/company': '/about',
  '/eligibility-requirements': '/eligibility',
  '/privacy-policy': '/privacy',
  // Sanity slug is `check-availability`; `/availability` has no page and 404s.
  '/map-and-office-locations': '/check-availability',
};

// Old blog posts, from rizzlending.com/post-sitemap.xml. Sanity has no post
// schema yet, so there is nowhere specific to send these — /blog preserves some
// link equity but loses the per-post rankings. Recreating the content is the
// real fix and is tracked separately.
const LEGACY_POSTS = [
  'porsche-gt3-rs-street-legal-track-car',
  'how-long-should-you-own-a-supercar-before-upgrading',
  '5-most-affordable-supercars',
  '2024-lamborghini-revuelto',
  '2024-aston-martin-valhalla',
  'customizing-your-exotic-car-does-it-affect-financing',
  'financing-an-exotic-car-can-be-smarter-than-paying-cash',
  'dead-cars-new-opportunities',
  'best-exotic-cars-of-2025',
  '10-supercars-that-could-appreciate-over-time',
  'the-bugatti-tourbillon-a-new-era-of-hypercar-greatness',
  'navigating-the-impact-of-new-u-s-tariffs-on-exotic-car-brands',
  'the-lamborghini-veneno-the-ultimate-dream-car-how-to-finance-one',
  'private-party-supercar-loans-in-utah-slc-lehi',
  '240-month-term-for-exotic-cars',
  'porsche-911-turbo-s-financing-smart-strategies-to-own-an-icon-without-overpaying',
  'long-term-exotic-car-loans-up-to-20-years-how-they-work-risks-and-smart-alternatives',
  'rizz-lending-audi-r8-v10-plus-financing',
  'ferrari-488-financing-guide-rizz-lending',
  'dealer-financing-for-exotic-cars-a-smart-guide',
  'private-party-exotic-car-financing-complete-guide',
  'luxury-auto-loans-guide-rates-terms-tips',
  'classic-car-financing-options-tips',
  'collector-car-loans-rates-terms-tips',
  'supercar-financing-options-costs-tips',
  'exotic-car-financing-rates-terms-tips',
  'audi-r8-v10-plus-financing-loans-lease-tips',
  'high-end-vehicle-financing-expert-guide',
  'financing-supercars-jumbo-auto-loans-explained',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [...Object.entries(LEGACY_PAGES).map(([source, destination]) => ({ source, destination, permanent: true })), ...LEGACY_POSTS.map((slug) => ({ source: `/${slug}`, destination: '/blog', permanent: true }))];
  },
};

export default nextConfig;
