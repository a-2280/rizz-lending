import Link from 'next/link';
import FooterReveal from './footerReveal';
import { resolveHref, linkifyContact } from '@/lib/links';

const isExternal = (href) => /^https?:\/\//i.test(href);

const SOCIAL_LABELS = { instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', x: 'X', linkedin: 'LinkedIn' };

export default function Footer({ tagline, socials, columns, legalText }) {
  if (!tagline && !socials?.length && !columns?.length && !legalText) return null;
  return (
    <FooterReveal>
      <div className='footer-content p30 py40 flex flex-col space-between'>
      <div className="flex space-between gap-20 m-flex-col">
        <div className='flex flex-col gap-20'>
          <div className="flex flex-col gap-20">
            <Link href="/" aria-label="Rizz Lending home">
              <div className='logo--main' />
            </Link>
            {tagline && <p className='max-250'>{tagline}</p>}
          </div>
          {socials?.length > 0 && (
            <div className="flex gap-15">
              {socials.map((social) => (
                <a className='icon p10 radius-circle border-line' key={social._key} href={social.href || '#'} title={SOCIAL_LABELS[social.platform] || social.platform} aria-label={SOCIAL_LABELS[social.platform] || social.platform}>
                  <span className={`icon--${social.platform}`} />
                </a>
              ))}
            </div>
          )}
        </div>
        {columns?.length > 0 && (
          <div className="flex gap-50">
            {columns.map((column) => (
              <div className='flex flex-col gap-15 f-14' key={column._key}>
                <p className='weight-700 uppercase'>{column.heading}</p>
                <div className='flex flex-col gap-10'>
                {column.links?.map((link) => {
                  const href = resolveHref(link) || '#';
                  return isExternal(href) ? (
                    <a className='footer-link text-silk-dim' key={link._key} href={href}>
                      {link.label}
                    </a>
                  ) : (
                    <Link className='footer-link text-silk-dim' key={link._key} href={href}>
                      {link.label}
                    </Link>
                  );
                })}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='flex flex-col gap-20'>
        <div className='line' data-sal />
      {legalText && <p className="f-14 text-silk-dim">{linkifyContact(legalText)}</p>}</div>
      </div>
    </FooterReveal>
  );
}
