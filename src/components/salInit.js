'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import sal from 'sal.js';

export default function SalInit() {
  const pathname = usePathname();
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!instanceRef.current) {
      instanceRef.current = sal();
    } else {
      instanceRef.current.update();
    }
  }, [pathname]);

  return null;
}
