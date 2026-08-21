import Link from 'next/link';
import { resolveHref } from '@/lib/links';

export default function TwoCardBlock({ eyebrow, heading, description, cards }) {
  const hasCards = cards?.length > 0;

  return (
    <section className="two-card bg-midnight text-silk-dim p30 py70 flex justify-center">
      <div className="flex flex-col gap-40">
        {(eyebrow || heading || description) && (
          <div className="flex flex-col gap-15">
            <div className="flex flex-col gap-10 fade--in" data-sal>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h2 className="h2 text-silk">{heading}</h2>}
            </div>
            {description && <p className="max-600 fade--in" data-sal>{description}</p>}
          </div>
        )}
        {hasCards && (
          <div className="flex gap-20 m-flex-col">
            {cards.map((card) => {
              const href = resolveHref(card.link);
              return (
                <Link className='card flex-1 p30 bg-white radius-5 border-line-d flex flex-col gap-10 max-600' key={card._key} href={href}>
                  <div className="flex flex-col gap-5">
                    {card.eyebrow && <span className="eyebrow f-14">{card.eyebrow}</span>}
                    {card.heading && <h3 className="h5 text-midnight">{card.heading}</h3>}
                  </div>
                  <div className="h-100 flex flex-col space-between gap-15">
                    {card.description && <p className='f-14 text-ink-dim'>{card.description}</p>}
                    {href && (
                      <span className="text-flame weight-600">
                        {card.link.label || 'Learn more'} <span className="">→</span>
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
