import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroFarming from '@/assets/hero-farming.jpg';
import heroProduce from '@/assets/hero-produce.jpg';
import heroTechnology from '@/assets/hero-technology.jpg';

const slides = [
  {
    id: 1,
    image: heroFarming,
    title: "EZOCHA FARM SERVICES LTD",
    subtitle: "Agribusiness One Stop Shop Service Provider",
    description: "Empowering sustainable farming practices and improving lives through innovative, inclusive, and environmentally conscious solutions."
  },
  {
    id: 2,
    image: heroProduce,
    title: "Quality Agricultural Products",
    subtitle: "From Farm to Table Excellence",
    description: "Making nutritional food available, accessible and affordable to Nigerians and Africans through our comprehensive value chain."
  },
  {
    id: 3,
    image: heroTechnology,
    title: "Modern Agricultural Technology",
    subtitle: "Innovation Drives Success",
    description: "Technology-driven services that enhance productivity, profitability, and well-being of farmers across Africa."
  }
];

export const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="text-center text-white max-w-4xl mx-auto">
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${
                index === currentSlide ? 'animate-fade-in' : ''
              }`}>
                {slide.title}
              </h1>
              <p className={`text-xl md:text-2xl mb-4 text-green-100 ${
                index === currentSlide ? 'animate-slide-left' : ''
              }`}>
                {slide.subtitle}
              </p>
              <p className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${
                index === currentSlide ? 'animate-slide-right' : ''
              }`}>
                {slide.description}
              </p>
              <div className={`space-x-4 ${
                index === currentSlide ? 'animate-scale-in' : ''
              }`}>
                <Button size="lg" className="bg-gradient-primary hover:bg-primary/90 text-white px-8 py-3">
                  Our Services
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-primary px-8 py-3"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};