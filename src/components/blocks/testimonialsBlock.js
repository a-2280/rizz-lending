import Image from 'next/image';

export default function TestimonialsBlock({ items }) {
  const hasItems = items?.length > 0;
  if (!hasItems) return null;

  return (
    <section className="p30 py70 bg-silk text-ink-dim flex justify-center">
      <div className="flex gap-45 m-flex-col">
        {items.map((item) => (
          <div className="max-600 flex flex-col gap-25 space-between" key={item._key}>
            <div className="flex flex-col gap-10 fade--in" data-sal>
              {item.eyebrow && <span className="eyebrow">{item.eyebrow}</span>}
              {item.quote && <p className="f-20 f-serif text-midnight italic">{item.quote}</p>}
              {item.attribution && <div className="f-14">{item.attribution}</div>}
            </div>
            {item.photo?.asset && (
              <div className="pos-rel ratio-16-10 radius-10 overflow">
                <Image className="" src={item.photo.asset.url} alt="" fill />
                {(item.photoCaption || item.photoSubcaption) && (
                  <>
                    <div className="scrim-b" />
                    <div className="absolute bottom-15 left-15 flex flex-col gap-5 f-14">
                      {item.photoCaption && <span className="text-silk weight-600">{item.photoCaption}</span>}
                      {item.photoSubcaption && <small className="text-silk-dim">{item.photoSubcaption}</small>}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
