import { HeroSlideshow } from '@/components/HeroSlideshow';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { PartnersSection } from '@/components/PartnersSection';
import { ContactSection } from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSlideshow />
      <AboutSection />
      <ServicesSection />
      <PartnersSection />
      <ContactSection />
    </div>
  );
};

export default Index;
