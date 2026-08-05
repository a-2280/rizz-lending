import Hero from '@/components/blocks/hero';
import EstimationBlock from '@/components/blocks/estimationBlock';
import ImageMarquee from './blocks/imageMarquee';
import ThreeCardBlock from './blocks/threeCardBlock';
import HighlightsBlock from './blocks/highlightsBlock';
import TestimonialsBlock from './blocks/testimonialsBlock';
import FaqBlock from './blocks/faqBlock';
import Cta from './blocks/cta';

export default function PageBuilder({ blocks }) {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((block) => {
    switch (block._type) {
      case 'hero':
        return <Hero key={block._key} {...block} />;
      case 'estimationBlock':
        return <EstimationBlock key={block._key} {...block} />;
      case 'imageMarquee':
        return <ImageMarquee key={block._key} {...block} />;
      case 'threeCardBlock':
        return <ThreeCardBlock key={block._key} {...block} />;
      case 'highlightsBlock':
        return <HighlightsBlock key={block._key} {...block} />;
      case 'testimonialsBlock':
        return <TestimonialsBlock key={block._key} {...block} />;
      case 'faqBlock':
        return <FaqBlock key={block._key} {...block} />;
      case 'cta':
        return <Cta key={block._key} {...block} />;
      default:
        return null;
    }
  });
}
