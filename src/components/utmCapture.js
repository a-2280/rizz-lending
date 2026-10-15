'use client';

import { useEffect } from 'react';
import { getFirstTouchUtms } from '@/lib/tracking';

export default function UtmCapture() {
  useEffect(() => {
    getFirstTouchUtms();
  }, []);

  return null;
}
