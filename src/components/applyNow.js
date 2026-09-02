import Link from 'next/link';

export default function ApplyNow({ className = 'button-1' }) {
  return (
    <Link className={className} href="https://application.rizzlending.com/applications/start/b3088bdf-6922-4801-a6f8-aeb6e487322e?embed=true">
      Apply Now
    </Link>
  );
}
