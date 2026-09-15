import ApplicationFrame from '@/components/applicationFrame';

// The loan application, embedded under the site header. The form itself is
// CreditAppCenter on application.rizzlending.com — this page only frames it. The
// footer is left off in src/components/footerReveal.js.
//
// A static route rather than a Sanity page for the same reason as /thank-you:
// every Apply Now button points here, so it can't be unpublished by accident.
//
// Kept out of ROUTES/sitemap and set to noindex: /apply-now is the page meant for
// search, and this one has no content of its own.

export const metadata = {
  title: 'Apply',
  description: 'Start your Rizz Lending application. Exotic, luxury & collector car financing with fast, private approvals.',
  robots: { index: false, follow: true },
};

export default function ApplyPage() {
  return (
    <main className="application-page pth">
      <ApplicationFrame />
    </main>
  );
}
