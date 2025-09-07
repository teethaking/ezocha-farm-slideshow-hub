-- Create news_posts table for farm feed content
CREATE TABLE public.news_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  author_name TEXT NOT NULL DEFAULT 'Ezocha Farms',
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  featured BOOLEAN NOT NULL DEFAULT false,
  views INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "News posts are viewable by everyone" 
ON public.news_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can create news posts" 
ON public.news_posts 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update news posts" 
ON public.news_posts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete news posts" 
ON public.news_posts 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_news_posts_updated_at
BEFORE UPDATE ON public.news_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample Nigerian farm news content
INSERT INTO public.news_posts (title, content, excerpt, category, featured) VALUES 
('Nigeria''s Rice Production Reaches New Heights in 2024', 'Nigerian farmers have achieved remarkable success in rice production this year, with local varieties showing exceptional yield improvements. The Anchor Borrowers Programme has contributed significantly to this growth, supporting over 4.8 million smallholder farmers across the country. Modern farming techniques and improved seedlings have resulted in a 35% increase in production compared to last year.', 'Rice production in Nigeria hits record numbers with support from government programs and modern farming techniques.', 'crops', true),

('Sustainable Farming Practices Transforming Northern Nigeria', 'Farmers in Northern Nigeria are embracing climate-smart agriculture to combat the effects of climate change. Techniques such as crop rotation, organic fertilization, and water-efficient irrigation systems are being adopted across Kano, Kaduna, and Sokoto states. These practices have not only improved soil health but also increased crop yields by an average of 28%.', 'Northern Nigerian farmers adopt sustainable practices to improve yields and combat climate change.', 'sustainability', true),

('Cassava Export Market Opens New Opportunities', 'The Nigerian cassava industry is experiencing unprecedented growth with new export opportunities opening in Asian markets. Local processing facilities have been upgraded to meet international standards, creating jobs for over 50,000 rural workers. The government estimates that cassava exports could generate $2.5 billion in revenue by 2025.', 'Cassava exports create new revenue streams and employment opportunities for Nigerian farmers.', 'market', false),

('Technology Integration in Nigerian Agriculture', 'Digital agriculture is revolutionizing farming practices across Nigeria. Mobile apps for weather forecasting, soil testing, and market price tracking are now accessible to farmers in rural areas. Drone technology for crop monitoring and precision agriculture tools are being piloted in several states, showing promising results for increased productivity.', 'Digital tools and technology are helping Nigerian farmers increase productivity and make informed decisions.', 'technology', false),

('Poultry Farming Boom in Southwest Nigeria', 'The poultry industry in Southwest Nigeria is experiencing rapid expansion with modern broiler and layer farms establishing operations in Ogun, Oyo, and Osun states. Improved breeds, better feed formulations, and disease management protocols have resulted in higher production rates and reduced mortality. Local consumption has increased by 40% in the past two years.', 'Poultry farming grows rapidly in Southwest Nigeria with improved production techniques.', 'livestock', false),

('Fish Farming Revolution in Delta Region', 'Aquaculture development in the Niger Delta has created sustainable income sources for coastal communities. Catfish and tilapia production using modern pond systems has doubled in the past 18 months. Training programs supported by international organizations have equipped farmers with best practices for fish health management and feed optimization.', 'Fish farming provides sustainable livelihoods for Delta region communities.', 'aquaculture', false);