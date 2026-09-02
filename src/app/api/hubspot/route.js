// HubSpot Forms API v3 proxy.
//
// We do not embed a HubSpot-designed form anywhere on this site — our own form
// components own their markup, styles and validation, and this route is only the
// destination for the data.
//
// This endpoint is intentionally token-less: the Forms API submit endpoint is
// unauthenticated by design, and HubSpot rejects requests that carry an
// Authorization header. The only reason this route exists rather than posting to
// HubSpot straight from the browser is to keep the form GUID server-side.

// Literal process.env reads, one per key — keeps them greppable and avoids any
// dependence on dynamic env lookup.
//
// No fallbacks: these identify which HubSpot account submissions land in, and
// the site is expected to move between accounts (our test portal now, the
// client's later). A wrong-but-plausible default would silently file leads in
// someone else's CRM, so an unset value has to fail loudly instead.
const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const FORM_GUID = process.env.HUBSPOT_FORM_GUID;

// HubSpot shards accounts across regions ("hublets"): na1, na2, eu1, ... na1
// uses the bare host; every other region needs its own, the way EU accounts
// must use api-eu1. The value is `data-region` in the form's embed code.
const REGION = process.env.NEXT_PUBLIC_HUBSPOT_REGION?.trim() || 'na1';
const SUBMIT_HOST = REGION === 'na1' ? 'api.hsforms.com' : `api-${REGION}.hsforms.com`;
const HUBSPOT_SUBMIT_URL = `https://${SUBMIT_HOST}/submissions/v3/integration/submit`;

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'bad_request', message: 'Request body must be JSON.' }, { status: 400 });
  }

  const { fields, hutk, pageUri, pageName } = payload ?? {};

  const formGuid = FORM_GUID?.trim();
  if (!formGuid) {
    // Waiting on the client for this GUID. Say so plainly rather than firing a
    // request at a URL we know is wrong.
    return Response.json({ error: 'not_configured', message: 'HUBSPOT_FORM_GUID is not set' }, { status: 500 });
  }

  const portalId = PORTAL_ID?.trim();
  if (!portalId) {
    return Response.json({ error: 'not_configured', message: 'NEXT_PUBLIC_HUBSPOT_PORTAL_ID is not set' }, { status: 500 });
  }

  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
    return Response.json({ error: 'bad_request', message: 'fields must be an object of { name: value }.' }, { status: 400 });
  }

  // HubSpot wants [{ name, value }]. Drop empties so optional fields don't
  // overwrite existing CRM values with blanks.
  const hubspotFields = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([name, value]) => ({ name, value: String(value).trim() }));

  if (hubspotFields.length === 0) {
    return Response.json({ error: 'bad_request', message: 'fields contained no non-empty values.' }, { status: 400 });
  }

  const body = {
    fields: hubspotFields,
    context: {
      // hutk is what attributes the submission to the visitor's tracked session.
      // Omit the key entirely when absent — HubSpot dislikes an empty string.
      ...(hutk ? { hutk } : {}),
      ...(pageUri ? { pageUri } : {}),
      ...(pageName ? { pageName } : {}),
    },
  };

  let hsResponse;
  try {
    hsResponse = await fetch(`${HUBSPOT_SUBMIT_URL}/${portalId}/${formGuid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('[hubspot] network error submitting form', err);
    return Response.json({ error: 'network_error', message: 'Could not reach HubSpot.' }, { status: 500 });
  }

  const raw = await hsResponse.text();
  let parsed;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = raw;
  }

  if (!hsResponse.ok) {
    // Pass HubSpot's status and error body through untouched. The failure we care
    // about is FIELD_NOT_IN_FORM_DEFINITION — a field name here that doesn't
    // exist on the HubSpot form definition. That has to be loud, not silent, and
    // HubSpot's own message names the exact offending field.
    console.error('[hubspot] submission failed', hsResponse.status, parsed);
    return Response.json(parsed, { status: hsResponse.status });
  }

  return Response.json({ ok: true });
}
