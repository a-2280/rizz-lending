'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const LOAD_NOW = ['/apply', '/contact', '/dealers', '/partners', '/careers'];
const INTERACTIONS = ['scroll', 'wheel', 'pointerdown', 'touchstart', 'keydown'];
const DELAY_AFTER_LOAD = 6000;

export default function HubspotScript({ src }) {
  const pathname = usePathname();
  const [triggered, setTriggered] = useState(false);
  const load = triggered || LOAD_NOW.includes(pathname);

  useEffect(() => {
    if (load) return;
    let timer;
    const trigger = () => setTriggered(true);
    const startTimer = () => {
      timer = setTimeout(trigger, DELAY_AFTER_LOAD);
    };
    INTERACTIONS.forEach((type) => window.addEventListener(type, trigger, { once: true, passive: true }));
    if (document.readyState === 'complete') startTimer();
    else window.addEventListener('load', startTimer, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', startTimer);
      INTERACTIONS.forEach((type) => window.removeEventListener(type, trigger));
    };
  }, [load]);

  return load ? <Script id="hs-script-loader" src={src} strategy="lazyOnload" async defer /> : null;
}
