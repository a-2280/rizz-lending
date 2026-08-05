'use client';

import { ReactLenis } from 'lenis/react';

const SCROLL_OPTIONS = {
    duration: 1.2,
    orientation: "vertical",
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    syncTouch: false,
}

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={SCROLL_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
