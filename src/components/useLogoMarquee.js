'use client';

import { useEffect, useRef } from 'react';

// Keeps the existing drag-to-pause behavior. When the row has links, hover and
// focus also hold the track so a moving logo can be clicked, then release it.
export function useLogoMarquee(emblaApi, hasLinks) {
  const held = useRef(false);

  useEffect(() => {
    if (!emblaApi) return;
    let timer;
    const play = () => {
      if (held.current) return;
      timer = setTimeout(() => {
        if (!held.current) emblaApi.plugins().autoScroll?.play();
      }, 300);
    };
    const cancel = () => clearTimeout(timer);
    emblaApi.on('pointerUp', play).on('pointerDown', cancel);

    const root = emblaApi.rootNode();
    const hold = () => {
      held.current = true;
      cancel();
      emblaApi.plugins().autoScroll?.stop();
    };
    const release = (event) => {
      if (event.relatedTarget && root.contains(event.relatedTarget)) return;
      held.current = false;
      play();
    };
    if (hasLinks) {
      root.addEventListener('mouseenter', hold);
      root.addEventListener('mouseleave', release);
      root.addEventListener('focusin', hold);
      root.addEventListener('focusout', release);
    }

    return () => {
      cancel();
      emblaApi.off('pointerUp', play).off('pointerDown', cancel);
      root.removeEventListener('mouseenter', hold);
      root.removeEventListener('mouseleave', release);
      root.removeEventListener('focusin', hold);
      root.removeEventListener('focusout', release);
    };
  }, [emblaApi, hasLinks]);
}
