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

## Currently pointed at a test account

`.env.local` holds Calvin's **test** portal (`247251136`, region `na2`), not the
client's. The client's real form was being created 2026-09-02.

## Next step

Get the new form's embed code, then swap three values in `.env.local`:

| From the embed snippet | Into `.env.local` |
| --- | --- |
| `data-portal-id` | `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` |
| `data-region` | `NEXT_PUBLIC_HUBSPOT_REGION` (empty for `na1`) |
| `data-form-id` | `HUBSPOT_FORM_GUID` |

Restart the dev server. No code changes — that's the whole handoff.

The two custom properties (`dealership_type`, `monthly_exotic_volume`) have to
be recreated in the client's portal; they only exist in the test one. Re-check
their dropdown internal values there, a fresh account may slug them differently.

## Open before launch

- **Production env vars.** `.env.local` is local only. The same three variables
  must be set wherever this deploys or the live form returns
  `500 HUBSPOT_FORM_GUID is not set`. Easy to miss because local works.
- **Client decisions** — who gets notified on submission, whether any follow-up
  workflow fires, and whether first/last name should be split into two fields
  (currently both words go into `firstname`; splitting is a code change).
- **Uncommitted work.** As of this writing the HubSpot work and a large amount of
  prior Sanity/component work sit uncommitted on `main`.

## Deliberately not built

Google Ads conversion tracking and GA4. An earlier commit had them
(`src/lib/analytics.js`, `src/components/analytics.js`); they were dropped on
2026-09-01 to keep this to the brief's scope. Those files stay deleted.
