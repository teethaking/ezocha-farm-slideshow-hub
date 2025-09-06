import { HeroSlideshow } from '@/components/HeroSlideshow';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { PartnersSection } from '@/components/PartnersSection';
import { ContactSection } from '@/components/ContactSection';
import { FloatingFarmBot } from '@/components/FloatingFarmBot';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSlideshow />
      <AboutSection />
      <ServicesSection />
      <PartnersSection />
      <ContactSection />
      <FloatingFarmBot />
    </div>
  );
};

export default Index;
