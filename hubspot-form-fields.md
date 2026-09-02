# HubSpot form setup

## TL;DR

HubSpot is just the database our contact form writes to. The form on the site is
ours — our HTML, our CSS, our validation. When someone submits it, we send the
data to HubSpot, and a contact shows up in the client's account.

Everything is built. One value is missing: the **form GUID**. Paste it into
`.env.local` and this is done.

## How it works

There are two ways to use HubSpot with a form. We're using the second one.

1. **Embed HubSpot's form.** They give you a script tag, it injects their form
   into your page. You get their markup and their styling. We are *not* doing
   this.
2. **Build your own form, send the data over.** Our form, our design, and
   HubSpot only receives the finished submission. This is what we do.

The path a submission takes:

```
visitor fills our form
  → POST /api/hubspot          (our route — src/app/api/hubspot/route.js)
  → HubSpot's Forms API
  → contact appears in the client's HubSpot
```

Our API route exists for one reason: to keep the form GUID on the server so it
never ships to the browser.

## The words HubSpot uses

- **Portal ID** — the account number. Public. Not hardcoded anywhere: the site
  is expected to move between accounts, so it comes from the environment and an
  unset value fails loudly rather than defaulting.
- **Form GUID** — the ID of one specific form inside that account. Looks like
  `3f2b1c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d`.
- **Region / "hublet"** — HubSpot shards accounts across `na1`, `na2`, `eu1`…
  Anything other than `na1` needs a region-specific API host, and the tracking
  script host shifts too. Verified working against an `na2` account:
  `api-na2.hsforms.com` and `js-na2.hs-scripts.com`. `na1` uses the bare hosts.
- **Property** — HubSpot's word for a field on a contact record. *Default*
  properties (`email`, `phone`, `firstname`) exist in every account. *Custom*
  ones have to be created by hand.
- **`hubspotutk`** — a cookie set by HubSpot's tracking script, which we load in
  the root layout. We read it and send it along so HubSpot can connect the
  submission to that visitor's earlier browsing. Without it, the contact looks
  like it appeared out of nowhere. Nothing breaks if it's missing.

### "If we built our own form, why does a form need to exist in HubSpot?"

This is the genuinely confusing part. HubSpot's API doesn't accept loose data —
you submit *to a specific form*, and that form defines which fields are allowed.
It's a schema. Send a field the form doesn't define and HubSpot rejects the whole
submission.

So the client still creates a form in HubSpot. Nobody ever sees it. It exists to
tell HubSpot "these seven fields are valid."

## What the client needs to create

Three different names are in play for every field, and confusing them is the
main way this goes wrong:

1. **What our site shows the visitor** — our copy. HubSpot never sees it.
2. **What HubSpot calls the property** — the label you search for when adding
   the field. Often different from ours.
3. **The internal name** — the only one that actually matters. This is what we
   send and what HubSpot matches on. It has to be character-for-character exact.

| Our form shows | Search HubSpot for | Object type | Internal name (must match) | Required in HubSpot |
| --- | --- | --- | --- | --- |
| Dealership name | Company Name | Contact | `company` | **Yes** |
| Your name | First Name | Contact | `firstname` | **Yes** |
| Email | Email | Contact | `email` | **Yes** |
| Phone | Phone Number | Contact | `phone` | No |
| Dealership type | *(create it — dropdown)* | Contact | `dealership_type` | No |
| Monthly exotic volume | *(create it — dropdown)* | Contact | `monthly_exotic_volume` | No |
| Anything else? | Message | Contact | `message` | No |

Notice how little column 1 and column 4 have in common. "Dealership name" is
HubSpot's `company`, "Your name" is `firstname`, and "Anything else?" is
`message`. Don't search HubSpot for our wording — search for column 2.

**Every field must be Object type: Contact.** Verify this per field: click the
field in the editor and the *Connected property* panel shows both the object
type and the internal name.

### The Company/Contact trap

HubSpot has two different properties both labelled roughly "Company name":

| | Object type | Internal name |
| --- | --- | --- |
| ❌ Wrong | Company | `name` |
| ✅ Right | Contact | `company` |

Searching `company` returns both. Picking the Company one looks completely
correct in the form preview and fails on every submission. Check the panel says
**Contact / `company`** before moving on.

The two custom dropdowns can be created inline while adding the field — there's
a *Create new property* button in the Edit field panel. No need to go to
Settings → Properties first.

### Required fields

**Toggle *Required field* on exactly three: `company`, `firstname`, `email`.**
Leave it off on the other four.

This has to mirror our site's validation, and getting it wrong breaks
submissions in a way that looks like our bug. HubSpot rejects any submission
missing a field its form marks required. The four optional ones are dropped from
the payload entirely when left blank — so if HubSpot marks `phone` required,
every visitor who skips the phone box gets a failed submission.

Going the other way is harmless: a field required on our site but optional in
HubSpot just means our form catches it first.

Note: we collect first and last name in one box, so both words land in
`firstname`. HubSpot's blank form starts with a `Last Name` field — delete it,
we never send `lastname`. If the client wants them split, we need to know before
launch.

## The dropdowns — the one real gotcha

A HubSpot dropdown option has two parts: the **label** people see, and the
**internal value** stored in the database. We send the internal value, so ours
have to match theirs.

Click the `</>` icon on an option row to reveal its internal value next to the
label. HubSpot mirrors the label by default, which is what we want — verify it
rather than assuming.

**Paste these, don't retype them.** The volume options use an en dash (–), not a
hyphen (-). They look nearly identical and are different characters, so a typed
hyphen produces a silent mismatch.

**`dealership_type`**
- `Franchise exotic / luxury`
- `Independent specialist`
- `Pre-owned / consignment`
- `Classic / collector`
- `Marketplace / auction`
- `Broker / finder`

**`monthly_exotic_volume`**
- `1–5 units`
- `6–15 units`
- `16–40 units`
- `40+ units`

If HubSpot slugs them instead (`franchise_exotic_luxury`), don't hand-edit the
ten values — send them over. Our component currently uses one string as both the
visible text and the submitted value, so those need splitting apart in
`src/components/blocks/dealerFaqFormBlock.js` for the site to keep displaying the
readable text while sending HubSpot's value.

## Finishing it

Publish the form, then **Get embed code**. Three values come out of that
snippet — that's the whole handoff:

```html
<script src="https://js-na2.hsforms.net/forms/embed/247251136.js" defer></script>
<div class="hs-form-frame" data-region="na2"
     data-form-id="2c232eee-649e-46af-91c3-2c3fa84d78af"
     data-portal-id="247251136"></div>
```

| From the snippet | Into `.env.local` |
| --- | --- |
| `data-portal-id` | `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` |
| `data-region` | `NEXT_PUBLIC_HUBSPOT_REGION` (leave empty for `na1`) |
| `data-form-id` | `HUBSPOT_FORM_GUID` |

We never use the snippet itself — our own form posts to `/api/hubspot`. It's
just where the values live.

Restart the dev server. No code changes, including when moving to a different
HubSpot account entirely.

## When it breaks

Until the GUID is set, every submission fails with
`500 HUBSPOT_FORM_GUID is not set`. That's expected, not a bug.

After that, the two usual failures both return HTTP 400, and we log HubSpot's
error verbatim to the browser console rather than swallowing it. Open devtools,
read which field it names, fix that one field.

- **`FIELD_NOT_IN_FORM_DEFINITION`** — we sent a field the form doesn't have.
  Usually a wrong internal name, and most often the Company/Contact trap above:
  the form has Company `name` where it needs Contact `company`.
- **`REQUIRED_FIELD`** — the form marks something required that we left blank.
  Only `email`, `firstname`, and `company` should be required.

Submissions never fail silently.

## Worth asking the client

- Who gets notified when a submission arrives? That's set up on the HubSpot form,
  not by us.
- Should any follow-up email or workflow fire off this form?
- Do they want first and last name as separate fields?
