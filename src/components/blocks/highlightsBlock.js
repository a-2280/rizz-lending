export default function HighlightsBlock({ eyebrow, heading, description, items }) {
  const hasItems = items?.length > 0;

  return (
    <section className="p30 py70 text-silk-dim flex justify-center">
      <div className="flex flex-col gap-40">
        {(eyebrow || heading || description) && (
          <div className="flex flex-col gap-15">
            <div className="flex flex-col gap-10">
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h2 className="h2 text-silk">{heading}</h2>}
            </div>
            {description && <p className="">{description}</p>}
          </div>
        )}
        {hasItems && (
          <div className="flex gap-20">
            {items.map((item) => (
              <div className="flex flex-col gap-15 max-300" key={item._key}>
                <div className="line-flame" />
                <div className="flex flex-col gap-10">
                  {item.heading && <h3 className="f-18 weight-700 text-silk">{item.heading}</h3>}
                  {item.description && <p className="f-14">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
