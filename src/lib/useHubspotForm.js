'use client';

import { useRef, useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Read the `hubspotutk` cookie set by HubSpot's tracking script (loaded in the
 * root layout). It's what links this submission to the visitor's browsing
 * history in the CRM — without it the contact looks like it came from nowhere.
 * Not readable server-side, so it has to be picked up here and passed through.
 *
 * Returns undefined when the script hasn't set it yet (first paint, ad blocker).
 */
function getHutk() {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Shared submit logic for our HubSpot-backed contact forms — used by any block
 * that posts to /api/hubspot. `formKey` tells the API route which HubSpot form
 * GUID to submit to (see FORM_GUIDS in src/app/api/hubspot/route.js); it's a
 * short name, never the GUID itself, which is what keeps the GUID server-side.
 */
export function useHubspotForm({ initialValues, requiredFields = [], formKey }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  // 'idle' | 'submitting' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  // Rejects re-entry while a request is open, so a rapid double-click can't
  // create two contacts.
  const inFlightRef = useRef(false);

  function update(name) {
    return (e) => {
      const { value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    };
  }

  function validate(vals) {
    const errs = {};
    for (const field of requiredFields) {
      const value = (vals[field] || '').trim();
      if (!value) errs[field] = 'Required';
      else if (field === 'email' && !EMAIL_RE.test(value)) errs[field] = 'Enter a valid email address';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'success') return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setStatus('submitting');

    try {
      const res = await fetch('/api/hubspot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formKey,
          fields: values,
          hutk: getHutk(),
          pageUri: typeof window === 'undefined' ? undefined : window.location.href,
          pageName: typeof document === 'undefined' ? undefined : document.title,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Log HubSpot's body verbatim — it names the exact field that's wrong.
        console.error('[hubspot] submission failed', res.status, data);
        setStatus('error');
        return;
      }

      setValues(initialValues);
      setStatus('success');
    } catch (err) {
      console.error('[hubspot] could not reach /api/hubspot', err);
      setStatus('error');
    } finally {
      inFlightRef.current = false;
    }
  }

  return { values, errors, status, update, handleSubmit };
}
