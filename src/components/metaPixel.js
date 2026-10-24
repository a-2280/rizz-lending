'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function MetaPixel() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
  }, [pathname]);

  return null;
}
