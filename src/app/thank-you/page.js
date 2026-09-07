import Link from 'next/link';
import { Check } from 'lucide-react';
import FireConversionOnMount from '@/components/fireConversionOnMount';

// Where the third-party application sends people once they finish, and so where
// the Google Ads conversion is recorded.
//
// Deliberately a static route rather than a Sanity page: a CMS page can be
// unpublished or renamed, and conversion tracking would stop with nothing
// visibly broken.
//
// Kept out of ROUTES/sitemap and set to noindex: landing here from a search
// result would record a conversion for someone who never applied.

export const metadata = {
  title: 'Application received',
  description: 'Your application has been received. A Rizz Lending advisor will be in touch shortly.',
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <main>
      <FireConversionOnMount />
      <section className="bg-midnight text-silk pth p30 py70 flex justify-center">
        <div className="max-600 flex flex-col align-center gap-30 text-center fade--in" data-sal>
          <div className="flex flex-col gap-20 align-center">
            <p className="eyebrow flex align-center gap-10">
              <Check size={14} strokeWidth={3} color="#7fc98a" />
              Application received
            </p>
            <h1 className="h1">Thanks — we&rsquo;ve got it.</h1>
            <p className="text-silk-dim max-500 text-balanced">An advisor is reviewing your application now. Expect to hear from us shortly — usually the same business day.</p>
          </div>
          <div className="flex gap-10">
            <Link className="button-1" href="/">
              Back to home
            </Link>
            <Link className="button-2" href="/vehicles">
              Browse what we finance
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
