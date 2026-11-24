// Apex, not www — www 301s to the apex, so a www fallback would make every
// canonical tag and every sitemap entry point at a redirect.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rizzlending.com";

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
  { path: "/exotic-car-financing", title: "Exotic Car Financing", priority: 0.8 },
  { path: "/porsche-financing", title: "Porsche Financing", priority: 0.7 },
  { path: "/ferrari-financing", title: "Ferrari Financing", priority: 0.7 },
  { path: "/lamborghini-financing", title: "Lamborghini Financing", priority: 0.7 },
  { path: "/mclaren-financing", title: "McLaren Financing", priority: 0.7 },
  { path: "/bentley-financing", title: "Bentley Financing", priority: 0.7 },
  { path: "/aston-martin-financing", title: "Aston Martin Financing", priority: 0.7 },
  { path: "/eligibility", title: "Eligibility" },
  { path: "/dealers", title: "For Dealers" },
  { path: "/partners", title: "For Platforms & Partners" },
  { path: "/about", title: "About" },
  { path: "/apply", title: "Apply" },
  { path: "/check-availability", title: "Check Availability" },
  { path: "/careers", title: "Careers" },
  { path: "/contact", title: "Contact" },
  { path: "/blog", title: "The Rizz Brief" },
  { path: "/privacy-policy", title: "Privacy Policy" },
  { path: "/licenses", title: "Licenses & Disclosures" },
];

const BORROW_SMART = { name: "Borrow Smart", path: "/overview" };

export const BREADCRUMBS = {
  "/overview": [BORROW_SMART],
  "/cash-out-refinance": [BORROW_SMART, { name: "Cash-Out Refinance", path: "/cash-out-refinance" }],
  "/lease-buyout": [BORROW_SMART, { name: "Lease Buyout", path: "/lease-buyout" }],
  "/vehicles": [{ name: "Vehicles", path: "/vehicles" }],
  "/hypercar": [{ name: "Hypercar", path: "/hypercar" }],
  "/eligibility": [{ name: "Eligibility", path: "/eligibility" }],
  "/dealers": [{ name: "Dealers", path: "/dealers" }],
  "/partners": [{ name: "Partners", path: "/partners" }],
  "/about": [{ name: "About", path: "/about" }],
  "/apply": [{ name: "Apply", path: "/apply" }],
  "/check-availability": [{ name: "Check Availability", path: "/check-availability" }],
  "/careers": [{ name: "Careers", path: "/careers" }],
  "/contact": [{ name: "Contact", path: "/contact" }],
  "/blog": [{ name: "Blog", path: "/blog" }],
  "/privacy-policy": [{ name: "Privacy Policy", path: "/privacy-policy" }],
  "/licenses": [{ name: "Licenses & Disclosures", path: "/licenses" }],
};

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
  { label: "My Account", href: "https://rizzlending.accountportalonline.com/" },
  { label: "Apply Now", href: "/apply" },
];
