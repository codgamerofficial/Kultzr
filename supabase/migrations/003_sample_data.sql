-- KULTZR E-Commerce Sample Data & Triggers
-- Populate database with streetwear products and setup automation

-- Insert sample categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Hoodies', 'hoodies', 'Premium streetwear hoodies for the urban culture', 1),
('T-Shirts', 't-shirts', 'Essential streetwear t-shirts and graphic tees', 2),
('Footwear', 'footwear', 'Limited edition sneakers and street shoes', 3),
('Bottoms', 'bottoms', 'Denim, cargo pants, and street shorts', 4),
('Jackets', 'jackets', 'Bomber jackets, track jackets, and outerwear', 5),
('Accessories', 'accessories', 'Caps, bags, and streetwear accessories', 6);

-- Insert sample products
INSERT INTO products (name, description, short_description, price, compare_at_price, sku, slug, category_id, brand, material, tags, is_featured, rating_average, rating_count) VALUES
(
  'STEALTH HOODIE',
  'Premium heavyweight cotton hoodie with embroidered branding. Built for the streets, refined for the culture. Made from 100% organic cotton with a heavyweight 400GSM fleece interior for maximum comfort and warmth.',
  'Premium heavyweight hoodie with embroidered logo',
  4999.00,
  5999.00,
  'STH-001',
  'stealth-hoodie',
  (SELECT id FROM categories WHERE slug = 'hoodies'),
  'KULTZR',
  '100% Organic Cotton, 400GSM Fleece',
  ARRAY['hoodie', 'streetwear', 'premium', 'organic'],
  true,
  4.8,
  127
),
(
  'GHOST RIDER TEE',
  'Limited edition graphic tee featuring the signature Ghost Rider artwork. 100% organic cotton with screen-printed graphics that won''t fade. Only 100 pieces made - grab yours before they''re gone.',
  'Limited edition graphic tee with premium print',
  1999.00,
  2499.00,
  'GRT-001',
  'ghost-rider-tee',
  (SELECT id FROM categories WHERE slug = 't-shirts'),
  'KULTZR',
  '100% Organic Cotton, 180GSM',
  ARRAY['tee', 'limited', 'graphic', 'organic'],
  true,
  4.6,
  89
),
(
  'CLOUD WALKER SNEAKERS',
  'Ultra-lightweight sneakers with premium leather upper and cloud-cushion technology. Engineered for all-day comfort with street-ready style. Features recycled rubber sole and breathable mesh lining.',
  'Ultra-lightweight sneakers with cloud cushioning',
  7999.00,
  8999.00,
  'CWS-001',
  'cloud-walker-sneakers',
  (SELECT id FROM categories WHERE slug = 'footwear'),
  'KULTZR',
  'Premium Leather Upper, Recycled Rubber Sole',
  ARRAY['sneakers', 'premium', 'lightweight', 'recycled'],
  true,
  4.9,
  203
),
(
  'URBAN DENIM JEANS',
  'Slim-fit denim with stretch technology. Washed for a vintage look using Japanese fabric and eco-friendly dyeing process. Features reinforced stitching and tapered leg for the perfect street fit.',
  'Slim-fit stretch denim with vintage wash',
  5499.00,
  6499.00,
  'UDJ-001',
  'urban-denim-jeans',
  (SELECT id FROM categories WHERE slug = 'bottoms'),
  'KULTZR',
  'Japanese Denim with Stretch',
  ARRAY['denim', 'jeans', 'stretch', 'japanese'],
  false,
  4.7,
  156
),
(
  'NIGHT BOMBER JACKET',
  'MA-1 inspired bomber jacket with modern streetwear twist. Water-resistant nylon shell with insulated lining. Features multiple pockets and signature KULTZR embroidery. Drops November 15, 2024.',
  'MA-1 inspired bomber with water resistance',
  8999.00,
  9999.00,
  'NBJ-001',
  'night-bomber-jacket',
  (SELECT id FROM categories WHERE slug = 'jackets'),
  'KULTZR',
  'Water-Resistant Nylon, Insulated Lining',
  ARRAY['bomber', 'jacket', 'water-resistant', 'limited'],
  true,
  4.8,
  94
),
(
  'FUTURE CAP',
  '6-panel structured cap with embroidered logo. Adjustable snapback closure. Made from premium cotton twill with moisture-wicking sweatband. Perfect for completing any streetwear fit.',
  'Structured cap with embroidered logo',
  1499.00,
  1799.00,
  'FC-001',
  'future-cap',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'KULTZR',
  'Premium Cotton Twill',
  ARRAY['cap', 'snapback', 'structured'],
  false,
  4.5,
  67
),
(
  'VOID BACKPACK',
  '30L capacity backpack with laptop sleeve and water-resistant coating. Features hidden pockets and premium YKK zippers. Perfect for daily carry with street style aesthetic.',
  '30L backpack with laptop sleeve and water resistance',
  6499.00,
  7499.00,
  'VB-001',
  'void-backpack',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'KULTZR',
  'Water-Resistant Fabric, YKK Zippers',
  ARRAY['backpack', 'laptop-sleeve', 'water-resistant'],
  true,
  4.9,
  143
),
(
  'REBEL HOODIE',
  'Oversized fit hoodie with French terry cotton and screen-printed graphics. Features dropped shoulders and relaxed silhouette for that perfect streetwear drape.',
  'Oversized fit hoodie with screen print',
  5499.00,
  6499.00,
  'RH-001',
  'rebel-hoodie',
  (SELECT id FROM categories WHERE slug = 'hoodies'),
  'KULTZR',
  'French Terry Cotton, 320GSM',
  ARRAY['hoodie', 'oversized', 'french-terry', 'screen-print'],
  false,
  4.7,
  178
);

-- Insert sample coupons
INSERT INTO coupons (code, type, value, minimum_amount, usage_limit, is_active, starts_at, expires_at) VALUES
('WELCOME10', 'percentage', 10.00, 2000.00, 1000, true, NOW(), NOW() + INTERVAL '30 days'),
('FIRSTORDER', 'fixed', 500.00, 3000.00, 500, true, NOW(), NOW() + INTERVAL '60 days'),
('STREETFASHION', 'percentage', 15.00, 5000.00, 200, true, NOW(), NOW() + INTERVAL '15 days'),
('FREESHIP', 'free_shipping', 0.00, 2500.00, NULL, true, NOW(), NOW() + INTERVAL '90 days');

-- TRIGGERS FOR AUTOMATION

-- Function to update product ratings when reviews are added
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE products 
  SET 
    rating_average = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews 
      WHERE product_id = NEW.product_id 
      AND is_approved = true
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE product_id = NEW.product_id 
      AND is_approved = true
    )
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update product rating when review is approved
CREATE TRIGGER trigger_update_product_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  WHEN (NEW.is_approved = true)
  EXECUTE FUNCTION update_product_rating();

-- Function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();