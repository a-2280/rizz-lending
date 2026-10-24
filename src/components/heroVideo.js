'use client';

import { useEffect, useRef } from 'react';

const DESKTOP = '(min-width: 769px)';

export default function HeroVideo({ mp4, webm, poster }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia(DESKTOP).matches) return;
    const play = () => videoRef.current?.play().catch(() => {});
    if (document.readyState === 'complete') play();
    else window.addEventListener('load', play, { once: true });
    return () => window.removeEventListener('load', play);
  }, []);

  return (
    <video className="bg-image" ref={videoRef} poster={poster} preload="none" muted loop playsInline aria-hidden="true">
      {webm && <source src={webm} type="video/webm" media={DESKTOP} />}
      <source src={mp4} type="video/mp4" media={DESKTOP} />
    </video>
  );
}
