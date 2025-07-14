import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

const partners = [
  "WCCI Agric Hub",
  "Faculty of Agriculture Abuja University",
  "Nigerian Army Farms and Ranch Ltd, Giri",
  "Eurafrican-Alliance ev",
  "College of Agribusiness Ibadan",
  "Interweave Solution International",
  "Urban Smart Farmers Forum"
];

export const PartnersSection = () => {
  return (
    <section className="py-16 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Partners & Associates</h2>
          <div className="w-24 h-1 bg-gradient-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Working together with leading institutions to drive agricultural innovation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
            <Card 
              key={index}
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-0 shadow-soft"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-primary group-hover:text-accent transition-colors duration-300">
                  {partner}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};