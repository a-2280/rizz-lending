import { HUBSPOT_PORTAL_ID } from '@/lib/analytics';

// HubSpot Forms API v3 proxy.
//
// This endpoint is intentionally token-less: the old WordPress site reached the
// CRM through the public Forms API + tracking script, with no private app and no
// API key, and we're replicating that. The submit endpoint below is
// unauthenticated by design — do NOT add an Authorization header, HubSpot rejects
// requests that carry one.
//
// Form GUIDs stay server-side (no NEXT_PUBLIC_ prefix) so they never ship to the
// browser; that's the only reason this route exists rather than posting direct.

const HUBSPOT_SUBMIT_URL = 'https://api.hsforms.com/submissions/v3/integration/submit';

// Literal process.env reads, one per key — keeps them greppable and avoids any
// dependence on dynamic env lookup.
const FORM_GUIDS = {
  quickQuote: { guid: process.env.HUBSPOT_FORM_GUID_QUICK_QUOTE, envVar: 'HUBSPOT_FORM_GUID_QUICK_QUOTE' },
  dealers: { guid: process.env.HUBSPOT_FORM_GUID_DEALERS, envVar: 'HUBSPOT_FORM_GUID_DEALERS' },
  getInTouch: { guid: process.env.HUBSPOT_FORM_GUID_GET_IN_TOUCH, envVar: 'HUBSPOT_FORM_GUID_GET_IN_TOUCH' },
};

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'bad_request', message: 'Request body must be JSON.' }, { status: 400 });
  }

  const { formKey, fields, hutk, pageUri, pageName } = payload ?? {};

  const entry = FORM_GUIDS[formKey];
  if (!entry) {
    return Response.json({ error: 'bad_request', message: `Unknown formKey "${formKey}". Expected one of: ${Object.keys(FORM_GUIDS).join(', ')}.` }, { status: 400 });
  }

  if (!Array.isArray(fields) || fields.length === 0) {
    return Response.json({ error: 'bad_request', message: 'fields must be a non-empty array of { name, value }.' }, { status: 400 });
  }

  const formGuid = entry.guid?.trim();
  if (!formGuid) {
    // Waiting on the client for this GUID. Say so plainly rather than firing a
    // request at a URL we know is wrong.
    return Response.json({ error: 'not_configured', formKey, message: `${entry.envVar} is not set yet — add the HubSpot form GUID to .env.local.` }, { status: 503 });
  }

  const body = {
    fields: fields.map(({ name, value }) => ({ name, value })),
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
    hsResponse = await fetch(`${HUBSPOT_SUBMIT_URL}/${HUBSPOT_PORTAL_ID}/${formGuid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('[hubspot] network error submitting form', formKey, err);
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
    // Pass HubSpot's error body through untouched. The failure we care about is
    // FIELD_NOT_IN_FORM_DEFINITION — a field name here that doesn't exist on the
    // HubSpot form definition. That has to be loud, not silent.
    console.error('[hubspot] submission failed', formKey, hsResponse.status, parsed);
    return Response.json({ error: 'hubspot_error', status: hsResponse.status, body: parsed }, { status: 500 });
  }

  return Response.json({ ok: true });
}
