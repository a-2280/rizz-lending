import Link from 'next/link';

export default function ApplyNow({ className = 'button-1' }) {
  return (
    <Link className={className} href="/apply-now">
      Apply Now
    </Link>
  );
}
