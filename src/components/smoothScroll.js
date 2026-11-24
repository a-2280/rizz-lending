'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [lenis]);

  // Lenis owns scrolling, so a cross-page hash (for example /#calculator) needs
  // an explicit scroll. scroll-margin-top on the target supplies the header offset.
  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    if (!hash || hash === '#') return;
    const scroll = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) lenis.scrollTo(target);
    };
    const frame = requestAnimationFrame(scroll);
    const timer = setTimeout(scroll, 50);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [lenis, pathname]);

  return (
    <ReactLenis root options={SCROLL_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
