-- Update product image URLs to match the correct assets
UPDATE products 
SET image_url = '/src/assets/yam-tuber.jpg' 
WHERE name = 'Yam Tubers';

UPDATE products 
SET image_url = '/src/assets/palm-oil.jpg' 
WHERE name = 'Palm Oil Fresh';

UPDATE products 
SET image_url = '/src/assets/watermelon.jpg' 
WHERE name = 'Watermelon Seeds';

UPDATE products 
SET image_url = '/src/assets/plantain-suckers.jpg' 
WHERE name = 'Plantain Suckers';