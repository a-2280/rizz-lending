import Link from 'next/link';
import { resolveHref } from '@/lib/links';

export default function AccountLoginBlock({ eyebrow, heading, subText, loginHeading, loginSubtext, emailLabel, emailPlaceholder, passwordLabel, loginButtonLabel, forgotPasswordLink, newCustomerLink, footerNote }) {
  return (
    <section className="account-login p30 py70 flex justify-center text-center">
      <div className="pth max-1400 flex flex-col gap-70 align-center">
        {(eyebrow || heading || subText) && (
          <div className="flex flex-col gap-20 max-600 fade--in" data-sal>
            <div className='flex flex-col gap-10'>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {heading && <h1 className="h2">{heading}</h1>}</div>
            {subText && <p className="text-silk-dim">{subText}</p>}
          </div>
        )}
        <div className="flex flex-col gap-20">
          <div className="w-100 max-500 radius-10 bg-silk text-ink-dim p30 flex flex-col gap-20 text-left">
            {(loginHeading || loginSubtext) && (
              <div className="flex flex-col gap-5">
                {loginHeading && <h2 className="h5 weight-700 text-carbon">{loginHeading}</h2>}
                {loginSubtext && <p className="f-14">{loginSubtext}</p>}
              </div>
            )}
            <form className="flex flex-col align-start gap-20">
              <div className="flex flex-col gap-5">
                <label className="form-label">{emailLabel}</label>
                <input className="form-input" type="email" placeholder={emailPlaceholder} />
              </div>
              <div className="flex flex-col gap-5">
                <label className="form-label">{passwordLabel}</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
              <button type="button" className="button-1 w-100 text-center justify-center flex">
                {loginButtonLabel}
              </button>
            </form>
            {(forgotPasswordLink?.label || newCustomerLink?.label) && (
              <div className="flex space-between align-center f-14">
                {forgotPasswordLink?.label && (
                  <Link href={resolveHref(forgotPasswordLink) || '#'} className="text-flame">
                    {forgotPasswordLink.label}
                  </Link>
                )}
                {newCustomerLink?.label && (
                  <Link href={resolveHref(newCustomerLink) || '#'} className="text-flame">
                    {newCustomerLink.label}
                  </Link>
                )}
              </div>
            )}
          </div>
          {footerNote && <p className="max-500 text-silk-dim f-14">{footerNote}</p>}
        </div>
      </div>
    </section>
  );
}
