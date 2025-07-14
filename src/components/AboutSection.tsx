import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Users } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section className="py-16 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Who We Are</h2>
          <div className="w-24 h-1 bg-gradient-accent mx-auto mb-6"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="text-lg leading-relaxed text-muted-foreground">
            An Agribusiness one stop shop service provider that offers services to support the 
            Establishment, Operation and management of business of Agriculture. Ezocha farm service 
            pride in her passion to make nutritional food available, accessible and affordable to 
            Nigerians and Africans as a whole, through promoting business and investment within the 
            Agricultural business value chain such as research, Agricultural tourism, Mechanization, 
            Processing/Packaging, Warehousing, Farmland leasing for food and job security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-medium hover:shadow-large transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Eye className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold text-primary">Vision Statement</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "To be a leading agribusiness service provider, empowering sustainable farming practices, 
                and improving the lives of farmers, communities, and consumers through innovative, inclusive, 
                and environmentally conscious solutions, thereby increasing youth participation in business of Agriculture."
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-large transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold text-primary">Mission Statement</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "To deliver innovative, sustainable, and technology-driven services that enhance the 
                productivity, profitability, and well-being of farmers, while promoting environmental 
                stewardship and contributing to a food-secure future."
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-medium">
          <div className="flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-accent mr-3" />
            <h3 className="text-2xl font-bold text-primary">Core Objectives</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Increase Farmer Productivity",
                description: "Provide farmers with access to innovative technologies, best practices, and expert advice to enhance their productivity and efficiency."
              },
              {
                title: "Boost Farmer Profitability", 
                description: "Offer services that help farmers increase their income, reduce costs, and improve their overall profitability."
              },
              {
                title: "Promote Environmental Stewardship",
                description: "Encourage and support sustainable agricultural practices that minimize environmental impact, conserve natural resources, and promote ecosystem health."
              },
              {
                title: "Support Farmer Well-being",
                description: "Provide services that promote the health, safety, and well-being of farmers, their families, and their communities."
              },
              {
                title: "Contribute to Food Security",
                description: "Collaborate with stakeholders to ensure that everyone has access to nutritious, sustainable, and affordable food."
              },
              {
                title: "Youth Participation",
                description: "At Ezocha farm services we believe that youths are the future of Agricultural business."
              }
            ].map((objective, index) => (
              <div key={index} className="p-4 border-l-4 border-primary bg-secondary/50 rounded-r-lg">
                <h4 className="font-semibold text-primary mb-2">{objective.title}</h4>
                <p className="text-sm text-muted-foreground">{objective.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};