import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section className="py-16 bg-gradient-hero text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Ready to transform your agricultural business? Contact us today for expert consultation and services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone Numbers</p>
                    <p className="text-green-100">+234 8035004617</p>
                    <p className="text-green-100">+234 9124049756</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-green-100">Learnder@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-green-100">Nigeria</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Our Commitment</h3>
              <div className="space-y-4">
                <p className="text-green-100 leading-relaxed">
                  We pride ourselves in creative, dynamic & bespoken services we offer to clients.
                </p>
                <p className="text-green-100 leading-relaxed">
                  At Ezocha Farm Services, we believe that youths are the future of Agricultural business.
                </p>
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="w-full bg-accent hover:bg-accent/90 text-white"
                    onClick={() => window.open('https://wa.me/2348035004617', '_blank')}
                  >
                    Start Your Agricultural Journey
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};