import Image from 'next/image';
import Link from 'next/link';
import ApplyNow from '../applyNow';
import { resolveHref } from '@/lib/links';

function GridPhoto({ item }) {
  return (
    <>
      <Image className="bg-image" src={item.photo.asset.url} alt={item.photoCaption || ''} fill />
      {item.photoCaption && (
        <>
          <div className="scrim-b" />
          <div className="absolute bottom-15 left-15 flex flex-col gap-5 f-14">
            <span className="text-silk weight-600">{item.photoCaption}</span>
          </div>
        </>
      )}
    </>
  );
}

export default function PhotoLogoBlock({ eyebrow, heading, description, items, logos, buttons }) {
  const photoItems = items?.filter((item) => item.photo?.asset) || [];
  const hasPhotos = photoItems.length > 0;
  const hasLogos = logos?.length > 0;

  return (
    <section className="photo-logo-block bg-silk text-ink-dim p30 py70">
      <div className="flex flex-col gap-30 max-1400 ma">
        {(eyebrow || heading || description) && (
          <div className="flex flex-col gap-15">
            <div className="flex flex-col gap-10 fade--in" data-sal>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h2 className="h2 text-carbon">{heading}</h2>}
            </div>
            {description && (
              <p className="fade--in" data-sal>
                {description}
              </p>
            )}
          </div>
        )}

        {hasPhotos && (
          <div className="flex gap-15 m-flex-col">
            {photoItems.map((item) => (
              <div className="pos-rel ratio-4-5 radius-10 overflow flex-1" key={item._key}>
                <GridPhoto item={item} />
              </div>
            ))}
          </div>
        )}

        {hasLogos && (
          <div className="grid-5">
            {logos.map((item) => (
              <div className="card p20 flex flex-col align-center gap-10 bg-white radius-10 overflow border-line-d" key={item._key}>
                <div className="pos-rel ratio-2-1">
                  {item.logo?.asset?.url && <Image className="bg-image contain" src={item.logo.asset.url} alt={item.brand || ''} fill />}
                </div>
                {item.brand && <span className="f-14 weight-600 f-display text-carbon">{item.brand}</span>}
              </div>
            ))}
          </div>
        )}

        {buttons?.length > 0 && (
          <div className="flex gap-10">
            {buttons.map((btn) =>
              btn._type === 'applyButton' ? (
                <ApplyNow key={btn._key} />
              ) : (
                <Link className="button-3" key={btn._key} href={resolveHref(btn)}>
                  {btn.label}
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
