import { PortableText } from 'next-sanity';
import Image from 'next/image';

const headingComponents = {
  block: {
    normal: ({ children }) => children,
  },
  marks: {
    textColor: ({ children, value }) => <span style={{ color: `var(--${value.color})` }}>{children}</span>,
  },
};

export default function ImageHero({ eyebrow, heading, subText, image, video }) {
  const imageUrl = image?.asset?.url;
  const videoUrl = video?.asset?.url;

  return (
    <section className='hero p30 pth bg-glow'>
      <div className="pos-rel pt70 flex flex-col gap-40 w-100 max-1400 ma">
        <div className="flex flex-col gap-20 z-3 pos-rel fade--in" data-sal>
          <div className='flex flex-col gap-5'>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="h1">{heading && <PortableText value={heading} components={headingComponents} />}</h1></div>
          {subText && <p className="f-18 text-silk-dim max-500 text-balanced">{subText}</p>}
        </div>
        {(imageUrl || videoUrl) && (
          <div className="pos-rel ratio-22-9 radius-10 overflow fade--in" data-sal>
            {imageUrl ? <Image className="bg-image" src={imageUrl} alt="" fill></Image> : ''}
            {videoUrl ? <video className="bg-image" src={videoUrl} autoPlay muted loop playsInline /> : ''}
          </div>
        )}
      </div>
    </section>
  );
}
