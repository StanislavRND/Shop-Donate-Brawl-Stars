import { Faq } from '@/widgets/Faq/Faq';
import { StepsSection } from '@/widgets/StepsSection/StepsSection';

import { AdvantagesSection } from './components/AdvantagesSection/AdvantagesSection';
import { FinalCtaSection } from './components/FinalCtaSection/FinalCtaSection';
import { HeroSection } from './components/HeroSection/HeroSection';

export const HomePage = () => {
  return (
    <main id="content">
      <HeroSection />
      <AdvantagesSection />
      <StepsSection />
      <Faq />
      <FinalCtaSection />
    </main>
  );
};
