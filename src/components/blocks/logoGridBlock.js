import Image from 'next/image';

export default function LogoGridBlock({ eyebrow, heading, description, logos }) {
  const hasLogos = logos?.length > 0;

  return (
    <section className="logo-grid p30">
      <div className='flex flex-col gap-30 max-1400 ma'>
      {(eyebrow || heading || description) && (
        <div className="flex flex-col gap-15">
          <div className="flex flex-col gap-10 fade--in" data-sal>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {heading && <h2 className="h2">{heading}</h2>}
          </div>
          {description && (
            <p className="text-silk-dim fade--in" data-sal>{description}</p>
          )}
        </div>
      )}
      {hasLogos && (
        <div className="grid-5">
          {logos.map((item) => (
            <div className="card p20 flex flex-col align-center gap-10 bg-carbon radius-10 overflow border-line" key={item._key}>
              <div className="pos-rel ratio-2-1 multiply">{item.logo?.asset?.url && <Image className='bg-image contain' src={item.logo.asset.url} alt={item.brand || ''} fill />}</div>
              {item.brand && <span className='f-14 weight-600 f-display text-silk'>{item.brand}</span>}
            </div>
          ))}
        </div>
      )}</div>
    </section>
  );
}
