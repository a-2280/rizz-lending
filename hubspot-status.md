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

## Deliberately not built

Google Ads conversion tracking and GA4. An earlier commit had them
(`src/lib/analytics.js`, `src/components/analytics.js`); they were dropped on
2026-09-01 to keep this to the brief's scope. Those files stay deleted.
