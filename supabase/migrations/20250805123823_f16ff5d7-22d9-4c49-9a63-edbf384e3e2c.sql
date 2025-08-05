-- Update products table with Nigerian currency and seed-specific products
UPDATE public.products SET 
  price = 15000,
  image_url = '/src/assets/cucumber-seeds.jpg'
WHERE name = 'Cucumber Seeds';

UPDATE public.products SET 
  price = 12000,
  image_url = '/src/assets/pepper-seeds.jpg'
WHERE name = 'Pepper Seeds';

UPDATE public.products SET 
  price = 8000,
  image_url = '/src/assets/tomato-seeds.jpg'
WHERE name = 'Tomato Seeds';

UPDATE public.products SET 
  price = 10000,
  image_url = '/src/assets/lettuce-spinach.jpg'
WHERE name = 'Lettuce Seeds';

UPDATE public.products SET 
  price = 5000,
  image_url = '/src/assets/carrots.jpg'
WHERE name = 'Carrot Seeds';

-- Add more Nigerian seed varieties
INSERT INTO public.products (name, description, price, category_id, image_url, stock, unit) VALUES
('Okra Seeds', 'Premium okra seeds perfect for Nigerian climate', 6000, 1, '/src/assets/cucumber-seeds.jpg', 150, 'packet'),
('Watermelon Seeds', 'Sweet watermelon seeds ideal for farming', 18000, 1, '/src/assets/pepper-seeds.jpg', 80, 'packet'),
('Plantain Suckers', 'Healthy plantain suckers for cultivation', 25000, 1, '/src/assets/tomato-seeds.jpg', 30, 'piece'),
('Yam Tubers', 'High-quality yam tubers for planting', 35000, 1, '/src/assets/lettuce-spinach.jpg', 20, 'tuber'),
('Palm Oil Fresh', 'Fresh palm oil from our farm', 45000, 2, '/src/assets/carrots.jpg', 25, 'gallon');