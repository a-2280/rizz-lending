'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const THRESHOLD = 0.25;

// Pages that fill the viewport themselves, where a footer below would only add a
// second scroll area. /apply is the embedded loan application.
const FOOTERLESS_PATHS = ['/apply'];

export default function FooterReveal({ children }) {
  const ref = useRef(null);
  const hidden = FOOTERLESS_PATHS.includes(usePathname());

  // Keyed on `hidden` because the layout keeps this mounted across navigation —
  // leaving /apply renders a fresh footer that still needs observing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle('sal-animate', entry.intersectionRatio >= THRESHOLD);
      },
      { threshold: THRESHOLD }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [hidden]);

  if (hidden) return null;

  return (
    <footer className="footer" ref={ref}>
      {children}
    </footer>
  );
}
