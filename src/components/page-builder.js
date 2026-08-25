import Hero from '@/components/blocks/hero';
import TextHero from '@/components/blocks/textHero';
import EstimationBlock from '@/components/blocks/estimationBlock';
import EstimatorHero from '@/components/blocks/estimatorHero';
import ImageHero from '@/components/blocks/imageHero';
import ImageMarquee from './blocks/imageMarquee';
import ThreeCardBlock from './blocks/threeCardBlock';
import TwoCardBlock from './blocks/twoCardBlock';
import IconCardsBlock from './blocks/iconCardsBlock';
import LeadershipStoryBlock from './blocks/leadershipStoryBlock';
import ChecklistBlock from './blocks/checklistBlock';
import HighlightsBlock from './blocks/highlightsBlock';
import TestimonialsBlock from './blocks/testimonialsBlock';
import FaqBlock from './blocks/faqBlock';
import DealerFaqFormBlock from './blocks/dealerFaqFormBlock';
import Cta from './blocks/cta';
import LogoGridBlock from './blocks/logoGridBlock';
import FinancedCarsBlock from './blocks/financedCarsBlock';
import PhotoLogoBlock from './blocks/photoLogoBlock';
import AccountLoginBlock from './blocks/accountLoginBlock';
import ApplyEstimatorBlock from './blocks/applyEstimatorBlock';
import OpenRolesBlock from './blocks/openRolesBlock';
import AvailabilityMapBlock from './blocks/availabilityMapBlock';
import LegalBlock from './blocks/legalBlock';
import BlogGrid from './blocks/blogGrid';

export default function PageBuilder({ blocks }) {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((block) => {
    switch (block._type) {
      case 'hero':
        return <Hero key={block._key} {...block} />;
      case 'textHero':
        return <TextHero key={block._key} {...block} />;
      case 'estimationBlock':
        return <EstimationBlock key={block._key} {...block} />;
      case 'estimatorHero':
        return <EstimatorHero key={block._key} {...block} />;
      case 'imageHero':
        return <ImageHero key={block._key} {...block} />;
      case 'imageMarquee':
        return <ImageMarquee key={block._key} {...block} />;
      case 'threeCardBlock':
        return <ThreeCardBlock key={block._key} {...block} />;
      case 'twoCardBlock':
        return <TwoCardBlock key={block._key} {...block} />;
      case 'iconCardsBlock':
        return <IconCardsBlock key={block._key} {...block} />;
      case 'leadershipStoryBlock':
        return <LeadershipStoryBlock key={block._key} {...block} />;
      case 'checklistBlock':
        return <ChecklistBlock key={block._key} {...block} />;
      case 'highlightsBlock':
        return <HighlightsBlock key={block._key} {...block} />;
      case 'testimonialsBlock':
        return <TestimonialsBlock key={block._key} {...block} />;
      case 'faqBlock':
        return <FaqBlock key={block._key} {...block} />;
      case 'dealerFaqFormBlock':
        return <DealerFaqFormBlock key={block._key} {...block} />;
      case 'cta':
        return <Cta key={block._key} {...block} />;
      case 'logoGridBlock':
        return <LogoGridBlock key={block._key} {...block} />;
      case 'financedCarsBlock':
        return <FinancedCarsBlock key={block._key} {...block} />;
      case 'photoLogoBlock':
        return <PhotoLogoBlock key={block._key} {...block} />;
      case 'accountLoginBlock':
        return <AccountLoginBlock key={block._key} {...block} />;
      case 'applyEstimatorBlock':
        return <ApplyEstimatorBlock key={block._key} {...block} />;
      case 'openRolesBlock':
        return <OpenRolesBlock key={block._key} {...block} />;
      case 'availabilityMapBlock':
        return <AvailabilityMapBlock key={block._key} {...block} />;
      case 'legalBlock':
        return <LegalBlock key={block._key} {...block} />;
      case 'blogGridBlock':
        return <BlogGrid key={block._key} {...block} />;
      default:
        return null;
    }
  });
}
