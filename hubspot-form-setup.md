# Task: Send our form submissions to HubSpot

## Context

This is a Next.js App Router site. When someone submits our contact form, we
need that person to show up as a contact in the client's HubSpot account.

Important: we are NOT embedding a HubSpot-designed form. Our existing form
component stays exactly as it is — same markup, same styles, same validation.
HubSpot is only the destination for the data.

The HubSpot account (portal) ID is `47162564`. The form ID is not known yet and
will be filled in later, so everything must work the moment that value is added
to `.env.local` with no other code changes.

## 1. Environment variables

Add to both `.env.local` and `.env.example`:

```
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=47162564
HUBSPOT_FORM_GUID=
```

Leave `HUBSPOT_FORM_GUID` empty. Do NOT put `NEXT_PUBLIC_` on it — the form ID
stays server-side only.

## 2. HubSpot tracking script

In the root layout, load HubSpot's tracking script using `next/script`:

- src: `https://js.hs-scripts.com/47162564.js`
- `strategy="afterInteractive"`, `id="hs-script-loader"`, async, defer

This script's only job is to set a browser cookie called `hubspotutk`. We read
that cookie later so HubSpot can connect a submission to that visitor's browsing
history instead of showing a contact that came from nowhere.

## 3. API route

Create `app/api/hubspot/route.ts` (match this repo's existing conventions if
they differ).

It accepts a POST with this body:

```json
{
  "fields": { "email": "a@b.com", "firstname": "Bob" },
  "hutk": "optional cookie value",
  "pageUri": "https://...",
  "pageName": "Contact"
}
```

It should:

- Return a 500 with the message `HUBSPOT_FORM_GUID is not set` if that env var
  is empty. Do not attempt the request.
- POST to
  `https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}`
- Send NO `Authorization` header. This endpoint is unauthenticated by design.
- Convert the `fields` object into the array shape HubSpot requires:

```json
{
  "fields": [{ "name": "email", "value": "a@b.com" }],
  "context": { "hutk": "...", "pageUri": "...", "pageName": "..." }
}
```

- Skip any field with an empty value.
- Only include `hutk` in `context` if it was provided.
- If HubSpot responds with an error, return HubSpot's own status code and its
  full JSON error body unchanged. Do not swallow or reword the error — the
  message names the exact field that's wrong, and I need to see it.
- Return `{ ok: true }` on success.

## 4. Wire up the form

- Find the existing contact form component in this repo.
- Do not restructure it, restyle it, or change its validation. Only add the
  submission call.
- After validation passes, read the `hubspotutk` value from `document.cookie`
  (it is not readable server-side) and POST everything to `/api/hubspot`.
- Use whatever success and error UI the form already has.
- On error, `console.error` the full response body so I can read it in devtools.

## 5. Constraints

- No new npm packages. Use `fetch`.
- Do not add a Google Tag Manager container.
- Keep the change to as few files as possible.

## 6. When you're done, tell me

- Every file you changed or created.
- The exact list of field names being sent to HubSpot, as a plain list. I need
  to give these to the client tomorrow so the HubSpot form matches.
