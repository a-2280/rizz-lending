import Link from 'next/link';
import { resolveHref } from '@/lib/links';

export const proseComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="h2">{children}</h2>,
    h3: ({ children }) => <h3 className="h3">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = resolveHref(value);
      if (!href) return children;
      if (/^https?:\/\//.test(href)) {
        return (
          <a href={href} target="_blank" rel="noreferrer">
            {children}
          </a>
        );
      }
      return <Link href={href}>{children}</Link>;
    },
  },
};
