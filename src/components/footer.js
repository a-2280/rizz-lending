import Link from 'next/link';
import FooterReveal from './footerReveal';

export default function Footer({ tagline, socials, columns, legalText }) {
  if (!tagline && !socials?.length && !columns?.length && !legalText) return null;
  return (
    <FooterReveal>
      <div className='footer-content p30 py40 flex flex-col space-between'>
      <div className="flex space-between gap-20">
        <div className='flex flex-col gap-20'>
          <div className="flex flex-col gap-10">
            <Link className="f-display h3 weight-700" href="/">
              Rizz <span className="text-light-orange">Lending</span>
            </Link>
            {tagline && <p className='max-250'>{tagline}</p>}
          </div>
          {socials?.length > 0 && (
            <div className="flex gap-15">
              {socials.map((social) => (
                <a className='icon p10 radius-circle border-line' key={social._key} href={social.href || '#'} title={social.platform}>
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
                {column.links?.map((link) => (
                  <Link className='text-silk-dim' key={link._key} href={link.pageSlug ? `/${link.pageSlug}` : '#'}>
                    {link.label}
                  </Link>
                ))}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='flex flex-col gap-20'>
        <div className='line' data-sal />
      {legalText && <p className="f-14 text-silk-dim">{legalText}</p>}</div>
      </div>
    </FooterReveal>
  );
}
