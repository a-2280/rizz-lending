'use client';

import { useEffect, useRef } from 'react';

const THRESHOLD = 0.25;

export default function FooterReveal({ children }) {
  const ref = useRef(null);

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
  }, []);

  return (
    <footer className="footer" ref={ref}>
      {children}
    </footer>
  );
}
