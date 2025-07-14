import { Card, CardContent } from '@/components/ui/card';
import { Tractor, GraduationCap, Sprout, Package, Wrench, Users } from 'lucide-react';

const services = [
  {
    icon: Tractor,
    title: "Farming",
    description: "Our farming activities are for dual purpose, food production and demonstration."
  },
  {
    icon: GraduationCap,
    title: "Capacity Building",
    description: "We facilitate both formal and informal training as well as extension services tailored to individuals and organizational needs."
  },
  {
    icon: Sprout,
    title: "Farm Establishment & Management",
    description: "Establishing farms (livestock, crop and agroforestry) and management for individuals and organizations."
  },
  {
    icon: Package,
    title: "Farm Inputs Supplies",
    description: "For there to be a good output from a farm, the quality of the input must be guaranteed, certified, scientifically and technologically improved."
  },
  {
    icon: Wrench,
    title: "Processing and Packaging",
    description: "In agricultural business, the more value you add to a produce the more money you make. We add value to produce such as sweet potatoes, millet, sorghum etc."
  },
  {
    icon: Users,
    title: "Business and Market Linkage",
    description: "We bring stakeholders together for mutual relationship and sustainable partnerships."
  }
];

export const ServicesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Services</h2>
          <div className="w-24 h-1 bg-gradient-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive agricultural solutions designed to empower farmers and transform communities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 border-0 shadow-medium"
            >
              <CardContent className="p-8 text-center h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};