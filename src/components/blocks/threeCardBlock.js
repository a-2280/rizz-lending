import Link from 'next/link';

function resolveHref(link) {
  if (!link) return null;
  if (link.linkType === 'page') return link.pageSlug ? `/${link.pageSlug}` : null;
  return link.href || null;
}

export default function ThreeCardBlock({ eyebrow, heading, description, cards }) {
  const hasCards = cards?.length > 0;

  return (
    <section className="three-card bg-silk text-ink-dim p30 py70 flex justify-center">
      <div className="flex flex-col gap-40">
        {(eyebrow || heading || description) && (
          <div className="flex flex-col gap-15">
            <div className="flex flex-col gap-10 fade--in" data-sal>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h2 className="h2 text-carbon">{heading}</h2>}
            </div>
            {description && <p className="max-600 fade--in" data-sal>{description}</p>}
          </div>
        )}
        {hasCards && (
          <div className="flex gap-20 m-flex-col">
            {cards.map((card) => {
              const href = resolveHref(card.link);
              return (
                <Link className='card max-400 p30 bg-white radius-5 border-line-d flex flex-col gap-10 m-max-unset' key={card._key} href={href}>
                  <div className="flex flex-col gap-5">
                    {card.eyebrow && <span className="eyebrow f-14">{card.eyebrow}</span>}
                    {card.heading && <h3 className="h5 text-midnight">{card.heading}</h3>}
                  </div>
                  <div className="h-100 flex flex-col space-between gap-15">
                    {card.description && <p className='f-14'>{card.description}</p>}
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
