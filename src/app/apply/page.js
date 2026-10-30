import ApplicationFrame from '@/components/applicationFrame';
import { linkifyContact } from '@/lib/links';

// The loan application, embedded under the site header. The form itself is
// CreditAppCenter on application.rizzlending.com — this page only frames it. The
// footer is left off in src/components/footerReveal.js.
//
// A static route rather than a Sanity page for the same reason as /thank-you:
// every Apply Now button points here, so it can't be unpublished by accident.
// /apply-now redirects here (next.config.mjs).

export const metadata = {
  title: { absolute: 'Apply for an Exotic Car Loan | Rizz Lending' },
  description: 'Apply for an exotic car loan with Rizz Lending. Start your secure application for supercar and luxury financing, with approvals typically within 24 hours.',
  alternates: { canonical: '/apply' },
};

export default function ApplyPage() {
  return (
    <main className="application-page pth">
      <h1 className="sr-only">Apply for Exotic Car Financing</h1>
      <ApplicationFrame />
      <p className="application-contact f-14">Questions? Call {linkifyContact('801-880-9955')}. Rizz Lending, LLC {linkifyContact('NMLS #2682279')}</p>
    </main>
  );
}
