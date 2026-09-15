import Link from 'next/link';
import ApplyNow from '@/components/applyNow';

export default function NotFound() {
  return (
    <main>
      <section className="bg-midnight text-silk pth p30 py70 flex justify-center">
        <div className="max-600 flex flex-col align-center gap-30 text-center fade--in" data-sal>
          <div className="flex flex-col gap-20 align-center">
            <p className="eyebrow">404</p>
            <h1 className="h1">Page not found</h1>
            <p className="text-silk-dim max-500 text-balanced">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
          </div>
          <div className="flex gap-10">
            <Link className="button-2" href="/">
              Back to home
            </Link>
            <ApplyNow />
          </div>
        </div>
      </section>
    </main>
  );
}
