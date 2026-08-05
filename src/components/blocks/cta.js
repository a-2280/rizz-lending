import Link from 'next/link';
import ApplyNow from '../applyNow';

export default function Cta({ heading, subText, buttons }) {
  const button = buttons?.[0];

  return (
    <section className="p30 py70 bg-flame flex flex-col align-center gap-30">
      <div className="flex flex-col gap-15 align-center fade--in" data-sal>
        {heading && <h2 className="h2">{heading}</h2>}
        {subText && <p className="max-400 text-center">{subText}</p>}
      </div>
      {button?._type === 'applyButton' && <ApplyNow className="button-2" />}
      {button?._type === 'link' && button.href && (
        <Link className="button-2" href={button.href}>
          {button.label || 'Learn more'}
        </Link>
      )}
    </section>
  );
}
