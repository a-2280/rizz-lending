'use client';

import { useEffect } from 'react';
import { getFirstTouchUtms, whenConsentKnown } from '@/lib/tracking';

export default function UtmCapture() {
  // Wait for the consent answer so a returning opted-out visitor never gets UTMs written.
  useEffect(() => whenConsentKnown(getFirstTouchUtms), []);

  return null;
}
