import AnchorLink from '../anchorLink';
import ApplyNow from '../applyNow';
import { resolveHref } from '@/lib/links';

export default function Cta({ heading, subText, buttons }) {
  const button = buttons?.[0];
  const href = button?._type === 'link' ? resolveHref(button) : null;

  return (
    <section className="p30 py70 bg-flame flex flex-col align-center gap-30">
      <div className="flex flex-col gap-15 align-center fade--in" data-sal>
        {heading && <h2 className="h2 text-center">{heading}</h2>}
        {subText && <p className="max-400 text-center">{subText}</p>}
      </div>
      {button?._type === 'applyButton' && <ApplyNow className="button-2" />}
      {href && (
        <AnchorLink className="button-2" href={href}>
          {button.label || 'Learn more'}
        </AnchorLink>
      )}
    </section>
  );
}
