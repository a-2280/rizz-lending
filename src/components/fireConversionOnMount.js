'use client';

import { useEffect, useRef } from 'react';
import { fireConversion } from '@/lib/tracking';

// Renders nothing. Its only job is letting a server-rendered page record the
// Google Ads conversion once it reaches the browser.
export default function FireConversionOnMount() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;

    // gtag loads with strategy="afterInteractive", so it may not be there on the
    // first tick. Retry briefly, then give up rather than poll forever.
    let attempts = 0;
    const id = setInterval(() => {
      if (fired.current) return clearInterval(id);
      if (fireConversion()) {
        fired.current = true;
        clearInterval(id);
      } else if (++attempts >= 20) {
        clearInterval(id);
      }
    }, 250);

    return () => clearInterval(id);
  }, []);

  return null;
}
