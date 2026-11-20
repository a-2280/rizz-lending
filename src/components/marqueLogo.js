import Image from 'next/image';
import Link from 'next/link';
import { sanityImage } from '@/lib/image';

export default function MarqueLogo({ item, width, height, className, isClone, href, label, marginRight }) {
  const image = <Image className={className} src={sanityImage(item.logo, width * 2)} alt={href || isClone ? '' : item.brand || ''} width={width} height={height} loading="eager" style={{ '--lw': `${width}px`, '--lh': `${height}px`, marginRight: href ? undefined : marginRight }} />;
  if (!href) return image;
  const external = /^https?:\/\//.test(href);
  const props = {
    className: 'marque-link shrink-0',
    'aria-label': isClone ? undefined : label,
    'aria-hidden': isClone || undefined,
    tabIndex: isClone ? -1 : undefined,
    style: { marginRight },
  };
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {image}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {image}
    </Link>
  );
}
