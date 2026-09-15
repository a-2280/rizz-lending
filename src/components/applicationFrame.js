'use client';

import { useEffect, useState } from 'react';
import { withGclid } from '@/lib/tracking';

// `embed=true` makes CreditAppCenter drop its own logo bar and footer, leaving
// just the form for the site header to sit above.
const APPLICATION_URL = 'https://application.rizzlending.com/applications/start/b3088bdf-6922-4801-a6f8-aeb6e487322e?embed=true';

export default function ApplicationFrame() {
  // Left empty until hydration so the iframe loads once, with the click ID
  // already in its src. Server-rendering a src and swapping it afterwards would
  // load the application twice.
  const [src, setSrc] = useState(null);
  useEffect(() => setSrc(withGclid(APPLICATION_URL)), []);

  return <div className="application-frame">{src && <iframe src={src} title="Rizz Lending loan application" />}</div>;
}
