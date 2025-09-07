import { HeroSlideshow } from '@/components/HeroSlideshow';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { PartnersSection } from '@/components/PartnersSection';
import { ContactSection } from '@/components/ContactSection';
import { FloatingFarmBot } from '@/components/FloatingFarmBot';
import { NewsFeedSection } from '@/components/NewsFeedSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSlideshow />
      <AboutSection />
      <ServicesSection />
      <NewsFeedSection />
      <PartnersSection />
      <ContactSection />
      <FloatingFarmBot />
    </div>
  );
};

export default Index;
