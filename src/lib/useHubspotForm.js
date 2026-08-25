'use client';

import { useCallback, useRef, useState } from 'react';
import { fireConversion, getHutk } from '@/lib/analytics';

/**
 * Shared submit logic for every HubSpot-backed form on the site.
 *
 * Put new forms on this hook rather than repeating the fetch + conversion code:
 * pass the formKey the route handler expects ('quickQuote' | 'dealers' | 'getInTouch')
 * and call submit() with a plain { fieldName: value } object.
 *
 *   const { submit, status, error } = useHubspotForm('dealers');
 *   await submit({ email: '…', firstname: '…' });
 *
 * status: 'idle' | 'submitting' | 'success' | 'error'
 */
export function useHubspotForm(formKey) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // Two separate guards, both needed:
  //  - inFlightRef rejects re-entry while a request is open (rapid double-clicks).
  //  - convertedRef makes the Google Ads conversion fire at most once per form
  //    instance, no matter how React re-renders or how many times submit resolves.
  const inFlightRef = useRef(false);
  const convertedRef = useRef(false);

  const submit = useCallback(
    async (fieldsObject) => {
      if (inFlightRef.current) return false;
      inFlightRef.current = true;
      setStatus('submitting');
      setError(null);

      // HubSpot wants [{ name, value }]. Drop empties so optional fields don't
      // overwrite existing CRM values with blanks.
      const fields = Object.entries(fieldsObject ?? {})
        .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
        .map(([name, value]) => ({ name, value: String(value).trim() }));

      try {
        const res = await fetch('/api/hubspot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formKey,
            fields,
            hutk: getHutk(),
            pageUri: typeof window === 'undefined' ? undefined : window.location.href,
            pageName: typeof document === 'undefined' ? undefined : document.title,
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setError(data ?? { error: 'unknown', message: `Request failed with status ${res.status}.` });
          setStatus('error');
          return false;
        }

        // Fire only once HubSpot has actually accepted the submission — not on
        // click, not on validation pass. There is no /thank-you route in this
        // site and nothing fires on page load, so this is the only path.
        if (!convertedRef.current) {
          convertedRef.current = true;
          fireConversion();
        }

        setStatus('success');
        return true;
      } catch (err) {
        setError({ error: 'network_error', message: err?.message ?? 'Could not reach the server.' });
        setStatus('error');
        return false;
      } finally {
        inFlightRef.current = false;
      }
    },
    [formKey],
  );

  return { submit, status, error };
}
