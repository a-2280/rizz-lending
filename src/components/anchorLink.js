'use client';

import Link from 'next/link';
import { useLenis } from 'lenis/react';

export default function AnchorLink({ href, className, children }) {
  const lenis = useLenis();
  const anchor = href && !href.includes('/') && !href.includes(':') ? `#${href.replace(/^#/, '')}` : null;

  if (!anchor) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={anchor} onClick={(e) => lenis && (e.preventDefault(), lenis.scrollTo(anchor, { offset: -100 }))}>
      {children}
    </a>
  );
}
