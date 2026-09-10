'use client';

import { useEffect, useState } from 'react';
import { trackEvent, withGclid } from '@/lib/tracking';

export const APPLICATION_URL = 'https://application.rizzlending.com/applications/start/b3088bdf-6922-4801-a6f8-aeb6e487322e?embed=true';

export default function ApplyNow({ className = 'button-1', label = 'Apply Now', onClick }) {
  // Resolved after hydration rather than on click, so the ad click ID is really
  // in the anchor's href — middle-click and "copy link address" carry it too.
  const [href, setHref] = useState(APPLICATION_URL);
  useEffect(() => setHref(withGclid(APPLICATION_URL)), []);

  function handleClick() {
    trackEvent('start_application');
    onClick?.();
  }

  return (
    <a className={className} href={href} onClick={handleClick}>
      {label}
    </a>
  );
}
