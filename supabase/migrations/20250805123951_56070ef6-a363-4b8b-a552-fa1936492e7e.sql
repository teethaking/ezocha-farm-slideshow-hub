-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'piece',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone"
ON public.categories FOR SELECT
USING (true);

-- Create policies for products (public read)
CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT
USING (true);

-- Create policies for cart_items
CREATE POLICY "Users can view their own cart items"
ON public.cart_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
ON public.cart_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
ON public.cart_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
ON public.cart_items FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policies for order_items
CREATE POLICY "Users can view order items for their orders"
ON public.order_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert categories
INSERT INTO public.categories (name, description) VALUES
('Seeds', 'High-quality seeds for farming'),
('Produce', 'Fresh farm produce'),
('Tools', 'Farming tools and equipment');

-- Insert Nigerian farm products with Naira pricing
INSERT INTO public.products (name, description, price, category_id, image_url, stock, unit) VALUES
('Cucumber Seeds', 'Premium cucumber seeds perfect for Nigerian climate', 15000, (SELECT id FROM categories WHERE name = 'Seeds'), '/src/assets/cucumber-seeds.jpg', 100, 'packet'),
('Pepper Seeds', 'Hot pepper seeds ideal for spicy Nigerian dishes', 12000, (SELECT id FROM categories WHERE name = 'Seeds'), '/src/assets/pepper-seeds.jpg', 120, 'packet'),
('Tomato Seeds', 'Large juicy tomato seeds for fresh produce', 8000, (SELECT id FROM categories WHERE name = 'Seeds'), '/src/assets/tomato-seeds.jpg', 150, 'packet'),
('Lettuce Seeds', 'Fresh lettuce seeds for salads and cooking', 10000, (SELECT id FROM categories WHERE name = 'Seeds'), '/src/assets/lettuce-spinach.jpg', 90, 'packet'),
('Carrot Seeds', 'Sweet carrot seeds perfect for Nigerian soil', 5000, (SELECT id FROM categories WHERE name = 'Seeds'), '/src/assets/carrots.jpg', 200, 'packet'),
('Okra Seeds', 'Premium okra seeds perfect for Nigerian climate', 6000, (SELECT id FROM categories WHERE name = 'Seeds'), '/src/assets/cucumber-seeds.jpg', 150, 'packet'),
('Watermelon Seeds', 'Sweet watermelon seeds ideal for farming', 18000, (SELECT id FROM categories WHERE name = 'Seeds'), '/src/assets/pepper-seeds.jpg', 80, 'packet'),
('Plantain Suckers', 'Healthy plantain suckers for cultivation', 25000, (SELECT id FROM categories WHERE name = 'Produce'), '/src/assets/tomato-seeds.jpg', 30, 'piece'),
('Yam Tubers', 'High-quality yam tubers for planting', 35000, (SELECT id FROM categories WHERE name = 'Produce'), '/src/assets/lettuce-spinach.jpg', 20, 'tuber'),
('Palm Oil Fresh', 'Fresh palm oil from our farm', 45000, (SELECT id FROM categories WHERE name = 'Produce'), '/src/assets/carrots.jpg', 25, 'gallon');