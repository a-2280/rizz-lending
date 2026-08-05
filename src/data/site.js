export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rizzlending.com";

export const ROUTES = [
  { path: "/", title: "Home" },
  { path: "/borrow-smart", title: "Borrow Smart" },
  { path: "/borrow-smart/cash-out-refinance", title: "Cash-Out Refinance" },
  { path: "/borrow-smart/lease-buyout", title: "Lease Buyout" },
  { path: "/vehicles", title: "Vehicles We Finance" },
  { path: "/eligibility", title: "Eligibility" },
  { path: "/dealers", title: "For Dealers" },
  { path: "/partners", title: "For Platforms & Partners" },
  { path: "/about", title: "About" },
  { path: "/apply", title: "Apply Now" },
  { path: "/account", title: "My Account" },
  { path: "/blog", title: "Blog" },
  { path: "/availability", title: "Check Availability" },
  { path: "/careers", title: "Careers" },
  { path: "/privacy", title: "Privacy Policy" },
];

export const NAV = [
  {
    label: "Borrow Smart",
    href: "/borrow-smart",
    children: [
      { label: "Cash-Out Refinance", href: "/borrow-smart/cash-out-refinance" },
      { label: "Lease Buyout", href: "/borrow-smart/lease-buyout" },
    ],
  },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "Dealers", href: "/dealers" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];

export const NAV_CTAS = [
  { label: "My Account", href: "/account" },
  { label: "Apply Now", href: "/apply" },
];
