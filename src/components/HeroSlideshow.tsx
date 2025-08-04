import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Leaf, ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
      {/* Header with Logo */}
      <header className="absolute top-0 left-0 right-0 z-30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full">
              <Leaf size={24} className="text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
              Ezocha Farms
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/shop')}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Shop
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/auth')}
            >
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
          </div>
        </div>
      </header>
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
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${
                index === currentSlide ? 'animate-scale-in' : ''
              }`}>
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:bg-primary/90 text-white px-8 py-3"
                  onClick={() => navigate('/shop')}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Shop Fresh Produce
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
                  onClick={() => window.open('https://wa.me/2348035004617', '_blank')}
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