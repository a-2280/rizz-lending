# HubSpot integration — where things stand

_Last updated 2026-09-02._

## Done

The full path works and has been tested end to end against a real HubSpot
account: our form → `/api/hubspot` → HubSpot Forms API → contact created.

- `src/app/api/hubspot/route.js` — the proxy. Region-aware host, no hardcoded
  portal, passes HubSpot's errors through untouched.
- `src/app/layout.js` — HubSpot tracking script (sets the `hubspotutk` cookie).
- `src/components/blocks/dealerFaqFormBlock.js` — submit call, success/error
  states. Markup, styles and validation unchanged from before.
- `.env.example` — documents the three variables.
- `hubspot-form-fields.md` — the field spec + setup guide. **This is the one to
  read**; it explains the whole model for someone new to HubSpot.

Verified working against an `na2`-region account, which confirmed the
`api-na2.hsforms.com` / `js-na2.hs-scripts.com` host pattern.

## Now pointed at the client's account

The client sent their form's embed code on 2026-09-02, and `.env.local` was
switched over to it: portal `47162564`, region `na1`, form GUID
`db4deb7f-f05f-443f-a9d7-606a3e770976`. Calvin's test portal (`247251136`, `na2`)
is kept in a comment there in case a rollback is needed.

`na1` means the bare hosts — `api.hsforms.com` and `js.hs-scripts.com` — which
the region logic picks automatically. No code change was needed for the swap.

The client also made **Phone** required on their form after sending the snippet.
Our form now requires it too (`validate()` in `dealerFaqFormBlock.js`), so a
blank phone is caught inline rather than coming back as a `REQUIRED_FIELD` 400 —
blank optional fields are dropped from the payload, which is what would have
made it fail. `hubspot-form-fields.md` was updated to match: four required
fields now, not three.

## Next step — verify against the real portal

Nothing here has been submitted to the client's account yet. Restart the dev
server, submit the form once, and read the console on failure.

The two custom properties (`dealership_type`, `monthly_exotic_volume`) only ever
existed in the test portal, so they have to be recreated in `47162564` under
exactly those internal names.

- `dealership_type` — the client was seen creating it on 2026-09-02 with the
  right object type (Contact) and internal name, but with **four** options
  (`Franchise`, `Independent`, `Marketplace`, `Broker`) instead of our six. Our
  form was changed to match; the six longer options from the prototype are gone.
  Their internal values still need confirming with the `</>` toggle — we're
  assuming HubSpot mirrored the labels.
- `monthly_exotic_volume` — seen 2026-09-02 with the same four options as the
  prototype and Required off. Its CRM Values appear to use plain **hyphens**
  where ours used en dashes, and our component was changed to match — but that
  reading came from a photo, not from copied text, so a real submission is what
  settles it.

A mismatch shows up as `FIELD_NOT_IN_FORM_DEFINITION`, or as a contact created
with those two fields blank — so check the contact record, not just the HTTP
status.

## Open before launch

- **Production env vars.** `.env.local` is local only and gitignored. All three
  variables must be set wherever this deploys — portal `47162564`, region `na1`
  (or empty), and the form GUID — or the live form returns
  `500 HUBSPOT_FORM_GUID is not set`. Easy to miss because local works.
- **Client decisions** — who gets notified on submission, whether any follow-up
  workflow fires, and whether first/last name should be split into two fields
  (currently both words go into `firstname`; splitting is a code change).

## 2026-09-07 — second HubSpot form, for Careers

`/api/hubspot` now takes an optional `formKey` in the POST body (`'dealer'` |
`'careers'`, defaults to `'dealer'` so the existing Dealers-page form needs no
changes) and looks up the GUID from a `FORM_GUIDS` map instead of a single env
var. New env var: `HUBSPOT_FORM_GUID_CAREERS`, empty until the client's Careers
form exists — until then that form's submissions 500 with
`HUBSPOT_FORM_GUID_CAREERS is not set`, same pattern as the original var.

New block, `heroFormBlock` (`src/components/blocks/heroFormBlock.js` +
`sanity/schemaTypes/blocks/heroFormBlockType.js`) — a hero with the contact
form embedded as the right-hand card, modeled on `estimatorHero`'s layout
rather than the two-column `dealerFaqFormBlock`. It's configurable per page:

- `hubspotForm` picks which GUID it posts to (`dealer` or `careers`).
- `entityLabel` swaps the word "Dealership" for "Business" etc. in the two
  field labels ("[Entity] name" / "[Entity] type") without touching what's
  actually sent to HubSpot — the property names stay `company` /
  `dealership_type` either way.
- `showEntityType` / `showVolume` toggle the two dropdowns off, since the
  Careers form doesn't define those properties (client hasn't finalized its
  field list beyond "drop those two").

The shared submit logic (validate, `hubspotutk` cookie read, fetch to
`/api/hubspot`, status states) was pulled out of `dealerFaqFormBlock.js` into
`src/lib/useHubspotForm.js` so `heroFormBlock` doesn't duplicate it.
`dealerFaqFormBlock.js` itself is untouched — still its own inline copy of the
same logic, since it's the one already verified end-to-end against the real
portal and there was no reason to risk it.

Partners page: reuses `heroFormBlock` with `hubspotForm: 'dealer'` and
`entityLabel: 'Business'` — same HubSpot form as Dealers, no new GUID needed.
Careers page: `hubspotForm: 'careers'`, `showEntityType`/`showVolume` off.
Both are Sanity content changes (add the block to each page in Studio), not
code changes — nothing in `src/app` names these pages, routing is fully
content-driven off `[...slug]`.

Still open: the real Careers HubSpot form doesn't exist yet, so
`HUBSPOT_FORM_GUID_CAREERS` is unset and that form 500s until the client
builds it and the GUID is added to `.env.local` — same as when
`HUBSPOT_FORM_GUID` was first added for Dealers. Whatever the client decides
for the Careers field list beyond dropping the two dropdowns (e.g. renaming
"Anything else?", adding a field) will need `heroFormBlock` revisited.

## 2026-09-07 — third HubSpot form, for a new Contact page

Same pattern again: `FORM_GUIDS` in `/api/hubspot` gained a `contact` key
(`HUBSPOT_FORM_GUID_CONTACT`, empty until the client's Contact form exists).
The inline ternary that named the missing env var in the "not configured"
error only handled two keys, so it's now a small `ENV_VAR_NAMES` map instead
— a third key would have needed another nested ternary.

New block, `contactFormBlock` (`src/components/blocks/contactFormBlock.js` +
`sanity/schemaTypes/blocks/contactFormBlockType.js`) — unlike `heroFormBlock`,
this isn't a relabeled reuse of an existing form. It's a plain centered
form card (no hero image/video, no FAQ accordion, no dealership-specific
fields) for a standalone Contact page the client asked for. Fields are
generic: name (`firstname`), email, phone, message — `firstname`/`email`
required, phone/message optional. `formKey` is hardcoded to `'contact'` in
the component rather than editor-configurable, since it exists for exactly
one HubSpot form.

Still open, same shape as the Careers form: the client hasn't built the real
Contact HubSpot form yet, so `HUBSPOT_FORM_GUID_CONTACT` is unset and
submissions 500 until it's added to `.env.local`. The field list above
(name/email/phone/message) is provisional — reconcile it against the client's
actual form once it exists, the way `dealership_type`/`monthly_exotic_volume`
had to be reconciled for Dealers (see above). The Contact page itself and its
footer link are Sanity content changes, not code — same as Partners/Careers.

## Deliberately not built

Google Ads conversion tracking and GA4. An earlier commit had them
(`src/lib/analytics.js`, `src/components/analytics.js`); they were dropped on
2026-09-01 to keep this to the brief's scope. Those files stay deleted.
