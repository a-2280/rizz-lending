// Checks that the Google Ads tracking is wired up correctly.
//
//   1. npm run dev          (leave it running)
//   2. npm run check:tracking   (in a second terminal)
//
// Everything it reports is checked against the actually-running site, not the
// source. Some things can only be confirmed in a real browser; it says so and
// tells you what to click.

import { readFileSync, existsSync } from 'node:fs';

const BASE = process.env.CHECK_URL ?? 'http://localhost:3000';
const ADS_ID = 'AW-18207288575';
const LABEL = 'a38uCILvwMgcEP_Z9OlD';
const VERIFICATION = '1VKd_1SCO54uhRHSA1yXRJ9zgprDR2KR3Th1QCylpKM';

const results = [];
const pass = (what, detail) => results.push({ ok: true, what, detail });
const fail = (what, detail, fix) => results.push({ ok: false, what, detail, fix });
const note = (what, detail) => results.push({ ok: null, what, detail });

async function get(path, redirect = 'manual') {
  return fetch(`${BASE}${path}`, { redirect, headers: { 'user-agent': 'check-tracking' } });
}

// --- 1. env ---------------------------------------------------------------
const envPath = '.env.local';
if (!existsSync(envPath)) {
  fail('Settings file', '.env.local is missing', 'Copy .env.example to .env.local and fill it in.');
} else {
  const env = readFileSync(envPath, 'utf8');
  const has = (k, v) => new RegExp(`^${k}=${v}`, 'm').test(env);
  if (has('NEXT_PUBLIC_GOOGLE_ADS_ID', ADS_ID)) pass('Google Ads ID is set', ADS_ID);
  else fail('Google Ads ID is set', 'not found in .env.local', `Add NEXT_PUBLIC_GOOGLE_ADS_ID=${ADS_ID}, then restart the dev server.`);

  if (has('NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL', LABEL)) pass('Conversion label is set', LABEL);
  else fail('Conversion label is set', 'not found in .env.local', `Add NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=${LABEL}, then restart the dev server.`);

  if (/^NEXT_PUBLIC_HUBSPOT_PORTAL_ID=\d+/m.test(env)) pass('HubSpot portal is set', env.match(/^NEXT_PUBLIC_HUBSPOT_PORTAL_ID=(\d+)/m)[1]);
  else fail('HubSpot portal is set', 'not found in .env.local', 'Add NEXT_PUBLIC_HUBSPOT_PORTAL_ID.');
}

// --- 2. is the site even up? ----------------------------------------------
let home;
try {
  home = await get('/', 'follow');
} catch {
  console.log(`\n  Can't reach ${BASE}\n`);
  console.log('  Start the site first:  npm run dev');
  console.log('  Then run this again in a second terminal.\n');
  process.exit(1);
}
const homeHtml = await home.text();

// --- 3. tags on the page ---------------------------------------------------
if (homeHtml.includes(ADS_ID)) pass('Google Ads tag is on the site', 'found on the homepage');
else fail('Google Ads tag is on the site', 'the ID is not in the page', 'Did you restart the dev server after editing .env.local?');

if (homeHtml.includes('hs-scripts.com')) pass('HubSpot tag is on the site', 'this is what tracks the ad click into the CRM');
else fail('HubSpot tag is on the site', 'not found', 'Check NEXT_PUBLIC_HUBSPOT_PORTAL_ID in .env.local.');

if (homeHtml.includes(VERIFICATION)) pass('Search Console tag is on the site', 'keeps the client from losing their Search Console');
else fail('Search Console tag is on the site', 'not found', 'Check the `verification` block in src/app/layout.js.');

// --- 4. the thank-you page -------------------------------------------------
const ty = await get('/thank-you', 'follow');
if (ty.ok) {
  const tyHtml = await ty.text();
  pass('Thank-you page loads', 'this is where the conversion gets recorded');
  if (/name="robots"[^>]*noindex/.test(tyHtml)) pass('Thank-you page is hidden from Google', 'stops fake conversions from search traffic');
  else fail('Thank-you page is hidden from Google', 'no noindex found', 'Check the `robots` block in src/app/thank-you/page.js.');
} else {
  fail('Thank-you page loads', `got ${ty.status}`, 'src/app/thank-you/page.js should exist.');
}

// --- 5. old URLs still work ------------------------------------------------
const redirects = [
  ['/company', '/about'],
  ['/loan-application', '/apply-now'],
  ['/privacy-policy', '/privacy'],
  ['/ferrari-488-financing-guide-rizz-lending', '/blog'],
];
let redirOk = 0;
for (const [from, to] of redirects) {
  const r = await get(from);
  if ([301, 308].includes(r.status) && r.headers.get('location')?.endsWith(to)) redirOk++;
}
if (redirOk === redirects.length) pass('Old website addresses still work', `${redirOk}/${redirects.length} checked — old Google results and ads won't hit a dead page`);
else fail('Old website addresses still work', `only ${redirOk}/${redirects.length} redirected`, 'Restart the dev server — changes to next.config.mjs need one.');

// --- 6. things only a browser can confirm ----------------------------------
note('Conversion actually fires', `Open DevTools > Network, type "conversion" in the filter, then load ${BASE}/thank-you — you should see a request to googleadservices.com`);
note('Ad click ID follows the customer', `Open ${BASE}/?gclid=TEST123, then hover any "Apply Now" button — the link should end in gclid=TEST123`);

// --- report ----------------------------------------------------------------
const failed = results.filter((r) => r.ok === false);
const checks = results.filter((r) => r.ok !== null);

console.log('\n  TRACKING CHECK\n  ' + '─'.repeat(60) + '\n');
for (const r of results) {
  if (r.ok === null) continue;
  console.log(`  ${r.ok ? '\x1b[32mOK  \x1b[0m' : '\x1b[31mFAIL\x1b[0m'}  ${r.what}`);
  console.log(`        ${r.detail}`);
  if (r.fix) console.log(`        \x1b[33mFix: ${r.fix}\x1b[0m`);
  console.log();
}

console.log('  ' + '─'.repeat(60));
console.log(`  ${checks.length - failed.length} of ${checks.length} automatic checks passed\n`);

if (failed.length === 0) {
  console.log('  Everything this script can check is working.\n');
  console.log('  Two things it cannot check from here — do these by hand:\n');
  for (const r of results.filter((x) => x.ok === null)) console.log(`   - ${r.what}\n     ${r.detail}\n`);
  console.log('  Then see google-migration-guide.md for the emails that still');
  console.log('  need sending (TechSol, and the client for Search Console).\n');
} else {
  console.log('  Fix the FAIL lines above, then run this again.\n');
}

process.exit(failed.length ? 1 : 0);
