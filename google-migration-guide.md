# Moving Rizz Lending's Google setup to the new site

_Written September 2026. Companion to `rizz-tracking-handoff.md`._

## The short version

The old site is WordPress. The new site is this one. **Same domain**, which makes
this much easier than it could have been — the client keeps their search
history, their rankings, and their Search Console property.

**The code side is done, and it needs no Google access to work.** Everything the
website has to do is now driven by two values in `.env`, not by any account
login.

What's left is a short list of things that need permissions we don't have. See
the next section — that's the main thing to read.

---

## What we can and can't do (read this first)

We have **Standard access to the Google Ads account only**. Google products are
separate services with separate permissions, so Ads access grants nothing in the
others:

| | Access? | What that means |
|---|---|---|
| **Google Ads** | ✅ Standard | Can view campaigns, conversion actions, ad URLs. Can't add users or change billing. |
| **Tag Manager** | ❌ none | Separate login at tagmanager.google.com. Can't view, edit, or preview tags. |
| **Search Console** | ❌ none | Separate login. Can't check verification, submit sitemaps, or see 404s. |
| **Analytics** | ❌ none | Doesn't exist anyway — see step 5. |
| **HubSpot** | ❌ none | We were given a form embed code, not portal access. |

**The good news:** the site no longer depends on any of it. The original plan was
to reuse the client's Tag Manager container, which would have required Tag
Manager access to verify or adjust. It doesn't anymore — see the box below.

**What still needs the client:** steps 2 and 4 need logins we don't have. Each
one has an email you can forward.

**Do step 0 before launch** — it's the one thing that silently breaks
everything, and it's ours, not the client's.

> ### Why we stopped using their Tag Manager container
>
> The old site loads a container (`GTM-PMH2Z782`). Inside it, the Google Ads
> conversion tag fires on a rule that reads:
>
> > page path **contains** `/thank-you/`
>
> Note the trailing slash. WordPress served `/thank-you/`; Next.js serves
> `/thank-you`, without one. **That rule can never match the new site**, so the
> conversion would have silently recorded nothing — the page would look fine,
> the container would load fine, and the number would just stay flat.
>
> Fixing the rule means editing the container, which needs Tag Manager access
> we don't have. So instead the site now calls Google Ads directly, using the
> same conversion ID and label that were inside that container. Same result,
> no dependency, and it's testable from the browser console.
>
> ⚠️ **If anyone adds that container back to the new site, remove one of the two
> conversion sources** — otherwise every application gets counted twice.

---

## The IDs, in plain English

| Thing | Value | What it is |
|---|---|---|
| **Conversion ID** | `AW-18207288575` | Which ad account to credit. |
| **Conversion label** | `a38uCILvwMgcEP_Z9OlD` | Which *action* happened. The random-looking half. |
| **GCLID** | `Cj0KCQjw...` | The ID Google puts on the URL when someone clicks an ad. How a lead gets traced back to the ad that paid for it. This one matters more than it looks — see step 4. |
| Tag Manager container | `GTM-PMH2Z782` | The client's, still on the old site. **Not used by the new site.** |

Both live values are in `.env.local` and `.env.example`, and must be set wherever
this deploys or no tracking loads at all.

---

## What I already did in code

- **Google Ads loads on every page** (`src/app/layout.js`) — which is also what
  stores the ad click ID for later.
- **Rebuilt `/thank-you`** (`src/app/thank-you/page.js`) and it fires the
  conversion itself when someone lands on it. Needs step 1.
- **Made the ad click ID survive the jump to the application**
  (`src/lib/tracking.js`, `src/components/applyNow.js`). See step 4.
- **Kept the Search Console verification tag** (`src/app/layout.js`). See step 2.
- **Redirected 40 old URLs** (`next.config.mjs`) so old search results and live
  ads don't land on a 404.
- **Fixed the canonical domain** from `www.` to the bare domain, matching the old
  site.

---

## Step 0 — Deploying

Setting the environment variables on the live host is the single most likely way
all of this silently breaks — `.env.local` does not travel with the code.

That, and the DNS cutover, are covered in **`launch-checklist.md`**. Do it before
launch.

---

## Step 1 — Email TechSol

**Highest-value item here, and it's one email.** We don't need access for this,
just an answer.

> When someone finishes an application on `application.rizzlending.com`, where do
> you send them afterwards? We've kept `https://rizzlending.com/thank-you/` live
> on the new site — please point the completion redirect there, same as before.

### Why it matters

On the old site the application ran *inside* rizzlending.com in an iframe, and
finishing it landed the customer on `/thank-you/` — still on the tracked site,
so the conversion could be recorded.

The new site **links out** to `application.rizzlending.com` instead. The customer
leaves. That final redirect back is the only thing that brings them into view
again, and it's what tells Google the application happened.

`/thank-you` is rebuilt and waiting. If TechSol still redirects there, this works
the moment the site goes live. (It handles both `/thank-you` and `/thank-you/` —
the trailing-slash problem that broke the old container's rule doesn't apply,
because the page fires the conversion itself rather than matching a URL pattern.)

**If they say no:** we fall back to counting the click-through to the application
instead of the completion. Already built — see step 6.

---

## Step 2 — Search Console (needs the client)

Website ownership is proved one of two ways, and one of them breaks silently at
launch. We can't check which is in use without access.

**Forward this to the client:**

> Could someone with access to Google Search Console check one thing before the
> new site goes live? Go to Settings → Ownership verification and tell me whether
> it says **"HTML tag"** or **"Domain name provider (DNS)"**.

**If "HTML tag":** we're already covered — I copied the tag onto the new site.
Just don't remove it.

**If "DNS":** nothing to do, it survives on its own.

> If it's the HTML tag and nobody had kept it, the client would lose access to
> their own Search Console at launch: no search traffic data, no way to submit a
> sitemap, no alerts when pages break. It's recoverable but it's a bad week. I
> kept the tag as insurance, so this check is confirmation rather than a risk.

While someone's in there, they should also **submit the sitemap** after launch
(Sitemaps → enter `sitemap.xml`) and watch **Pages** for 404 spikes for a month.

---

## Step 3 — Check the conversion action (we can do this)

Standard Ads access is enough.

1. **ads.google.com** → **Goals** → **Conversions** → **Summary**
2. Click **TechSol - Submitted application 32418**
3. Click **Tag setup** → **Use Google Tag Manager**

Google shows a Conversion ID and label. They should read `18207288575` and
`a38uCILvwMgcEP_Z9OlD` — the values now in `.env`. If they don't match, tell me;
we're pointing at the wrong action.

While you're there, note **"Last conversion recorded."** If it's months old, that
tag has been broken on the *old* site for a while, which is worth telling the
client regardless of this migration.

---

## Step 4 — The part that matters most: HubSpot

Look at the conversion list again. Three of the four say **"Import from clicks"**:

- Hubspot Submitted Loan Application — **Primary** — 27
- Deal Created / Lifecycle becomes Approved — **Primary** — 5
- HubSpot - Funded Loan — **Primary** — 1

"Import from clicks" means these **don't come from the website at all**. HubSpot
sends them to Google directly, matching each customer to their original ad click
using the GCLID.

They're all marked **Primary**, which means these — not the website tag — are
what Google's automated bidding actually optimises against. The website tag is
Secondary: recorded, but not acted on.

**So the single most important thing in this migration is that the GCLID keeps
reaching HubSpot.** It's plumbing, not tagging, and it's the part that would
otherwise have been quietly missed.

The website half is handled in code: the click ID is stored on arrival and passed
along to the application subdomain when someone clicks Apply.

The HubSpot half needs someone with portal access. **Forward this:**

> Could someone check that the Google Ads integration in HubSpot is still
> connected? Settings → Integrations → Connected Apps → Google Ads. It should be
> linked to account 853-756-4291, with the loan-application, deal-created and
> funded-loan conversion events enabled.

If that integration ever disconnects, those three numbers go to zero and the
client's campaigns lose the data they bid on — while the website still looks
perfectly fine. Worth re-checking a week after launch.

---

## Step 5 — Check where the ads point (we can do this)

Several live ads point at pages that are moving.

1. **ads.google.com** → **Campaigns**
2. **Columns** → add **Final URL**
3. Look for anything containing `/loan-application/`, `/quick-quote/`,
   `/loan-services/`, `/vehicle-we-finance/`, `/company/`,
   `/eligibility-requirements/`
4. Also check **Assets → Sitelinks** — they have their own URLs and get forgotten

The redirects catch all of these, so nothing breaks. But Google mildly prefers
final URLs that point straight at the real page, and a stale one can occasionally
trip an ad disapproval. Tidy when there's time; not a launch blocker.

Full old-to-new map is at the top of `next.config.mjs`.

---

## Step 6 — After launch

**Confirm a real conversion lands.** The only proof that counts. Submit a genuine
application, wait up to 24 hours, then check **Goals → Conversions → Summary**
and look at "Last conversion recorded."

**Optional:** the site already sends a `start_application` signal whenever
someone clicks through to the application. If step 1 comes back badly and TechSol
won't redirect to a page we control, this becomes the best available signal and
can be turned into a conversion action in the Ads account — which we *do* have
access to. Ask and I'll write up those clicks.

Don't reuse the `a38uCILvwMgcEP_Z9OlD` label for it. That label means "submitted
an application"; a click-out only means "started" one. Reusing it would merge two
different things into one number and corrupt the history.

---

## Step 7 — Google Analytics (optional)

There isn't any. Never has been — I checked the container and there's no GA4, no
Universal Analytics, nothing. So this isn't a migration, it's a decision.

Worth doing because analytics history **cannot be backfilled**. A property
created today starts collecting today; one created in six months has a six-month
hole nobody can fill.

It needs Analytics access (and someone to create the property), so it's a client
task. Once a property exists, send me the `G-` measurement ID and it's a
two-line change here — no Tag Manager needed.

---

## Appendix — how to test it

Three levels. The first two take five minutes and need no Google access at all.

> **Turn your ad blocker off**, or use a clean browser profile. Blockers eat
> Google and HubSpot scripts and you'll debug code that was already fine.

### Level 1 — browser console

Run `npm run dev`, open **http://localhost:3000/?gclid=TEST123**, let it finish
loading, then open DevTools (`Cmd+Option+J`) and paste:

```js
(() => {
  const links = [...document.querySelectorAll('a[href*="application.rizzlending.com"]')];
  console.table({
    'gtag loaded': typeof window.gtag === 'function',
    'click ID found': new URLSearchParams(location.search).get('gclid') || document.cookie.match(/_gcl_aw=([^;]*)/)?.[1] || 'NONE',
    'apply links on page': links.length,
    'links carrying click ID': `${links.filter((a) => a.href.includes('gclid=')).length}/${links.length}`,
    'HubSpot script': !!document.querySelector('script[src*="hs-scripts.com"]'),
    'Search Console tag': document.querySelector('meta[name="google-site-verification"]')?.content ?? 'MISSING',
  });
})();
```

`gtag loaded` and `HubSpot script` should be `true`, and **links carrying click
ID** should match — `5/5`, not `0/5`.

**Then test the cookie fallback** — this is the case that matters in real life,
because someone who clicks an ad usually browses a few pages before applying.
From that same `?gclid=TEST123` page, navigate by *clicking a nav link* (don't
paste a fresh URL), then re-run the snippet. The click ID should still be found,
now via the cookie. If it reads `NONE` after navigating, attribution is broken.

### Level 2 — the conversion actually firing

This is the one that matters, and you can watch it happen:

1. Open DevTools → **Network** tab
2. In the filter box, type `conversion`
3. Load **http://localhost:3000/thank-you**

You should see a request to `googleadservices.com/pagead/conversion/...` or
`googleads.g.doubleclick.net`. That request *is* the conversion being recorded.
Click it and check the URL contains `18207288575` and `a38uCILvwMgcEP_Z9OlD`.

No request means it didn't fire. Check `.env.local` has both `NEXT_PUBLIC_GOOGLE_ADS_*`
values and that you restarted the dev server after adding them.

Also confirm the page is not indexable, since it fires a conversion:

```bash
curl -s http://localhost:3000/thank-you | grep -o 'name="robots" content="[^"]*"'
```

Must contain `noindex`.

### Level 3 — redirects

```bash
curl -sI http://localhost:3000/company | head -2
curl -sI http://localhost:3000/loan-application | head -2
curl -sI http://localhost:3000/ferrari-488-financing-guide-rizz-lending | head -2
```

Expect `308 Permanent Redirect` and a `location:` of `/about`, `/apply-now`,
`/blog`.

> **308, not 301.** Next.js uses 308 for permanent redirects. Google treats them
> identically — it just looks wrong if you expect 301.

Config changes don't hot-reload; restart the dev server or you'll chase a ghost.

### If something fails

| Symptom | Usually means |
|---|---|
| `gtag loaded: false` | Ad blocker, or the `NEXT_PUBLIC_GOOGLE_ADS_ID` is missing — restart the dev server after adding it |
| `links carrying click ID: 0/5` | No `gclid` in the URL, or the snippet ran before hydration finished — reload and wait a second |
| Click ID `NONE` after navigating | The `_gcl_aw` cookie isn't being written; check `gtag('config', ...)` runs in `layout.js` |
| No conversion request on `/thank-you` | Missing conversion label in `.env.local` |
| `Search Console tag: MISSING` | The `verification` block in `src/app/layout.js` |
| Redirect 404s | Source typo in `next.config.mjs`, or dev server needs a restart |
| Conversions counted twice | Someone added the `GTM-PMH2Z782` container back. Remove it, or remove our code fire |

---

## Reference

| | |
|---|---|
| Google Ads account | 853-756-4291 |
| Conversion ID | `AW-18207288575` |
| Conversion label | `a38uCILvwMgcEP_Z9OlD` |
| Search Console tag | `1VKd_1SCO54uhRHSA1yXRJ9zgprDR2KR3Th1QCylpKM` |
| HubSpot portal | `47162564` (region na1) |
| Old GTM container | `GTM-PMH2Z782` — **not used by the new site** |
| Application system | `application.rizzlending.com` (TechSol) |
| Servicing portal | `rizzlending.accountportalonline.com` |
| Google Analytics | none |

## Still open

- **`/apply-now` has no working application form.** It's a payment calculator
  plus a link out to TechSol. A product decision, not a bug — but it means the
  site can only ever observe a click-out, never a completed application.
- **29 old blog posts have nowhere to go.** They redirect to `/blog`, which keeps
  some search value but loses their individual rankings. No blog post type exists
  in Sanity yet. Its own project.
- **The mobile menu links all point at `#`** (`src/components/header.js`).
  Unrelated to tracking, but mobile is where most ad clicks land.
