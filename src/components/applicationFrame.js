'use client';

import { useEffect, useRef } from 'react';
import { getFbclid, getUtms, readCookie, withGclid } from '@/lib/tracking';

// `embed=true` makes CreditAppCenter drop its own logo bar and footer, leaving
// just the form for the site header to sit above.
const APPLICATION_URL = 'https://application.rizzlending.com/applications/start/b3088bdf-6922-4801-a6f8-aeb6e487322e?embed=true';
const APPLICATION_ORIGIN = 'https://application.rizzlending.com';

export default function ApplicationFrame() {
  // The src is set once, after hydration, with the click ID already in it.
  // Server-rendering a src and swapping it afterwards would load the
  // application twice, so the iframe renders without one and the effect fills it in.
  const frameRef = useRef(null);
  useEffect(() => {
    const url = new URL(withGclid(APPLICATION_URL));
    Object.entries({ fbclid: getFbclid(), ...getUtms(), hubspotutk: readCookie('hubspotutk') }).forEach(([key, value]) => value && url.searchParams.set(key, value));
    frameRef.current.src = url.toString();
  }, []);

  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== APPLICATION_ORIGIN) return;

      const data = event.data;
      if (!data || data.type !== 'applicationCompleted') return;

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {}, data.applicationId ? { eventID: String(data.applicationId) } : {});
      }

      if (data.url) {
        setTimeout(() => {
          window.location.href = data.url;
        }, 300);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="application-frame">
      <iframe ref={frameRef} title="Rizz Lending loan application" />
    </div>
  );
}
