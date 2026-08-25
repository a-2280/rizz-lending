export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rizzlending.com";

// Consumed by sitemap.js and robots.js only.
//
// These MUST match the published Sanity page slugs — every non-home route is
// served by src/app/[...slug]/page.js, so a path with no matching slug 404s and
// the sitemap ends up advertising dead URLs to Google (and to any live ad).
// Verified against the production dataset; re-check after publishing/renaming a page.
export const ROUTES = [
  { path: "/", title: "Home" },
  { path: "/overview", title: "Borrow Smart" },
  { path: "/cash-out-refinance", title: "Cash-Out Refinance" },
  { path: "/lease-buyout", title: "Lease Buyout" },
  { path: "/vehicles", title: "Vehicles We Finance" },
  { path: "/hypercar", title: "Hypercar" },
  { path: "/eligibility", title: "Eligibility" },
  { path: "/dealers", title: "For Dealers" },
  { path: "/partners", title: "For Platforms & Partners" },
  { path: "/about", title: "About" },
  { path: "/apply-now", title: "Apply Now" },
  { path: "/my-account", title: "My Account" },
  { path: "/check-availability", title: "Check Availability" },
  { path: "/careers", title: "Careers" },
  { path: "/blog", title: "The Rizz Brief" },
  { path: "/privacy", title: "Privacy Policy" },
];

// NOTE: nothing imports NAV/NAV_CTAS — src/components/header.js hardcodes its own
// links. Kept in sync with the real slugs so they aren't a trap if anything does
// start importing them.
export const NAV = [
  {
    label: "Borrow Smart",
    href: "/overview",
    children: [
      { label: "Overview", href: "/overview" },
      { label: "Cash-Out Refinance", href: "/cash-out-refinance" },
      { label: "Lease Buyout", href: "/lease-buyout" },
    ],
  },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Hypercar", href: "/hypercar" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "Dealers", href: "/dealers" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];

export const NAV_CTAS = [
  { label: "My Account", href: "/my-account" },
  { label: "Apply Now", href: "/apply-now" },
];
