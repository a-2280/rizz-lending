'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGclid, trackEvent } from '@/lib/tracking';

// The application is embedded on /apply (src/app/apply/page.js), so visitors keep
// the site header instead of leaving for application.rizzlending.com.
const APPLY_PATH = '/apply';

export default function ApplyNow({ className = 'button-1', label = 'Apply Now', onClick }) {
  // Resolved after hydration rather than on click, so the ad click ID is really
  // in the anchor's href — middle-click and "copy link address" carry it too.
  // /apply reads it back off its own URL and passes it on to the application.
  const [href, setHref] = useState(APPLY_PATH);
  useEffect(() => {
    const gclid = getGclid();
    if (gclid) setHref(`${APPLY_PATH}?${new URLSearchParams({ gclid })}`);
  }, []);

  function handleClick() {
    trackEvent('start_application');
    onClick?.();
  }

  return (
    <Link className={className} href={href} onClick={handleClick}>
      {label}
    </Link>
  );
}
