'use client';

import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_OPTIONS = {
    duration: 1.2,
    orientation: "vertical",
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    syncTouch: false,
    // Lenis is stepped from GSAP's ticker below instead of its own rAF loop, so
    // the scroll position and the ScrollTrigger parallax update in the same frame.
    autoRaf: false,
}

const syncScrollTrigger = () => ScrollTrigger.update();

export default function SmoothScroll({ children }) {
  // Above the provider, useLenis reads the root instance once it exists.
  const lenis = useLenis(syncScrollTrigger);

  useEffect(() => {
    if (!lenis) return;
    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [lenis]);

  return (
    <ReactLenis root options={SCROLL_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
