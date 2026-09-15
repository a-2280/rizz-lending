'use client';

import { useEffect, useRef } from 'react';
import { fireConversion } from '@/lib/tracking';

// Renders nothing. Its only job is letting a server-rendered page record the
// Google Ads conversion once it reaches the browser.
export default function FireConversionOnMount() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;

    // Finishing the application embedded on /apply loads this page inside the
    // iframe, not the tab. Move the tab here and record the conversion only from
    // that top-level load, so it isn't nested under a second header or counted
    // twice. replace() also keeps Back from returning to a finished application.
    if (window.self !== window.top) {
      window.top.location.replace(window.location.href);
      return;
    }

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
