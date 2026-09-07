# Taking the new site live

_Written September 2026. Tracking specifics live in `google-migration-guide.md`._

Deploying to Netlify and pointing `rizzlending.com` at it, without breaking the
client's email in the process.

---

## What's where today

Four separate services. They're commonly mistaken for one, and the difference is
the whole reason this is safe or isn't:

| Service | Its job | Changes at launch? |
|---|---|---|
| **GoDaddy** | Domain registration + DNS records | Two records change. Nothing else. |
| **WP Engine** | Hosts the WordPress site | Replaced by Netlify. Cancel later, not now. |
| **Microsoft 365** | Company email | **Never touched.** But its records live in GoDaddy's DNS. |
| **Cloudflare** | WP Engine's CDN | Drops out on its own. |

Verified: `www.rizzlending.com` → `wp.wpenginepowered.com`, apex →
`141.193.213.11`, nameservers `ns21/ns22.domaincontrol.com` (GoDaddy),
MX → `rizzlending-com.mail.protection.outlook.com`.

> **The new site can't be uploaded to GoDaddy or WP Engine.** Both run PHP.
> Next.js needs a Node server, which is what Netlify provides. There's no version
> of this where you swap files in the existing hosting.

---

## Before you start

- [ ] The old WordPress site is still live and stays that way through cutover
- [ ] You have GoDaddy DNS access (or the client can make two record changes)
- [ ] `npm run build` succeeds locally

> This is Next.js 16, which is new. Do a test deploy to Netlify **early** —
> well before cutover — so any build incompatibility surfaces on a day when it
> doesn't matter.

---

## 1. Deploy to Netlify

Connect the repo. Netlify auto-detects Next.js; build command `npm run build`.

You'll get a temporary address like `rizz-lending.netlify.app`. **The real site is
untouched and still live** — everything from here until step 4 is invisible to
the public.

> Don't hand-configure a start command. `npm start` in this repo deliberately
> runs `next dev` (see AGENTS.md). Netlify's Next runtime doesn't use it.

## 2. Set the environment variables

**The most likely way this breaks.** `.env.local` is gitignored — those values
exist only on your machine and do **not** travel with the code.

If they're missing in production nothing errors. The site looks perfect, Google
records nothing, and the dealer form returns a 500. You'd have no reason to
suspect it, because everything passes locally.

Netlify → **Site configuration → Environment variables**. Set all six for
Production:

```
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-18207288575
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=a38uCILvwMgcEP_Z9OlD
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=47162564
NEXT_PUBLIC_HUBSPOT_REGION=na1
HUBSPOT_FORM_GUID=db4deb7f-f05f-443f-a9d7-606a3e770976
NEXT_PUBLIC_SITE_URL=https://rizzlending.com
```

`NEXT_PUBLIC_*` values are baked in at build time, so **redeploy after adding
them** — Trigger deploy → **Clear cache and deploy site**. Setting them on an
existing deploy changes nothing until it rebuilds.

## 3. Test on the temporary address

```bash
CHECK_URL=https://rizz-lending.netlify.app npm run check:tracking
```

Nine automatic checks. Then by hand:

- [ ] Submit the dealer form → contact appears in HubSpot
- [ ] Click through a few pages; check nothing 404s
- [ ] Open `/?gclid=TEST123`, hover Apply Now, confirm the link ends in `gclid=TEST123`
- [ ] Load `/thank-you` with DevTools → Network → filter `conversion`; expect a
      `googleadservices.com` request
- [ ] Check it on a phone

`NEXT_PUBLIC_SITE_URL` points at the real domain, so canonical tags on the
temporary address will reference `rizzlending.com`. That's correct — don't
"fix" it.

## 4. Point the domain

In Netlify: **Domain management → Add domain**. It shows the exact records.

In **GoDaddy DNS**, change only these two:

| Record | Name | New value |
|---|---|---|
| `A` | `@` | the IP Netlify gives you |
| `CNAME` | `www` | your `.netlify.app` address |

**Leave every other record exactly as it is.** Takes effect in minutes to an hour.

### ⚠️ When Netlify offers to manage your DNS, decline

Netlify will suggest switching nameservers to it. **Don't.**

GoDaddy's DNS holds the client's Microsoft 365 email (`MX`, `SPF`), their
Microsoft domain verification, and a Google Search Console verification. Moving
nameservers without recreating all of it **takes down company email** — the worst
outcome available in this project, and a two-click mistake.

Changing two records inside GoDaddy is what Netlify's docs call "external DNS."
Fully supported, and the safe path. Everything else stays untouched because you
never touch it.

## 5. Verify against the real domain

Once it resolves:

```bash
CHECK_URL=https://rizzlending.com npm run check:tracking
```

- [ ] `https://rizzlending.com` serves the new site
- [ ] `https://www.rizzlending.com` redirects to it
- [ ] HTTPS works (Netlify provisions the certificate automatically — can take a
      few minutes after DNS resolves)
- [ ] **Send the client a test email and have them reply.** Confirms you didn't
      disturb the mail records.
- [ ] Old URLs redirect: `curl -sI https://rizzlending.com/company`

## 6. Leave WP Engine running

For two weeks minimum. It costs one more billing cycle and it's your rollback.

### Rollback

Change the records back in GoDaddy:

| Record | Name | Value |
|---|---|---|
| `A` | `@` | `141.193.213.11` |
| `CNAME` | `www` | `wp.wpenginepowered.com` |

The old site is still sitting there unchanged. That's the entire reason you
don't cancel WP Engine on day one.

---

## After launch

- [ ] Ask the client to submit `sitemap.xml` in Search Console
- [ ] Watch Search Console → Pages for 404 spikes, weekly for a month
- [ ] Confirm a real conversion lands in Google Ads (up to 24h — see
      `google-migration-guide.md` step 6)
- [ ] Once stable, tell the client they can cancel WP Engine — that's a real
      monthly saving and a reasonable thing to be thanked for

## Still open at launch

- **`/apply-now` has no working application form** — it's a calculator plus a
  link out to TechSol. Worth being explicit with the client that this is by
  design, not an oversight.
- **The mobile menu links all point at `#`** (`src/components/header.js`). Mobile
  is where most ad clicks land, so this is worth fixing before spending money
  driving traffic to it.
- **29 old blog posts** redirect to `/blog` rather than to real content. Their
  individual search rankings will decay. Recreating them is its own project.
