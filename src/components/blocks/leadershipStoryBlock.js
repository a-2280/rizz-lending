export default function LeadershipStoryBlock({ eyebrow, heading, description, card }) {
  return (
    <section className="leadership-story p30 py70 flex justify-center bg-silk text-ink-dim">
      <div className="flex align-center space-between m-flex-col max-1400 ma">
        <div className="flex-1 flex flex-col gap-15">
          <div className="flex flex-col gap-10 fade--in" data-sal>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {heading && <h2 className="h2 text-carbon">{heading}</h2>}
          </div>
          {description && <p className="pre-line fade--in" data-sal>{description}</p>}
        </div>
        {card && (card.eyebrow || card.name || card.bio) && (
          <div className="flex-1 pl50">
            <div className="card p30 radius-5 flex flex-col gap-10 bg-carbon border-line m-max-unset">
              {card.eyebrow && <span className="eyebrow">{card.eyebrow}</span>}
              {card.name && <p className="h3 text-silk">{card.name}</p>}
              {card.bio && <p className="f-14 text-silk-dim">{card.bio}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
