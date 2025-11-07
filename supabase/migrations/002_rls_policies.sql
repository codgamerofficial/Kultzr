-- KULTZR E-Commerce Row Level Security Policies
-- Secure data access for streetwear e-commerce platform

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE printful_sync ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- CATEGORIES POLICIES
-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

-- Only admins can manage categories (will be handled in application logic)
-- Note: RLS is enabled but no policies for insert/update/delete means only service role can do this

-- PRODUCTS POLICIES
-- Anyone can view active products
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Anyone can view featured products (for homepage)
CREATE POLICY "Anyone can view featured products" ON products
  FOR SELECT USING (is_active = true AND is_featured = true);

-- Only admins can manage products (service role only)
-- Note: RLS enabled but no insert/update/delete policies for regular users

-- PRODUCT VARIANTS POLICIES
-- Anyone can view variants of active products
CREATE POLICY "Anyone can view active product variants" ON product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_variants.product_id 
      AND products.is_active = true
    ) AND is_active = true
  );

-- Only admins can manage variants (service role only)

-- PRODUCT IMAGES POLICIES
-- Anyone can view images of active products
CREATE POLICY "Anyone can view product images" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id 
      AND products.is_active = true
    )
  );

-- ADDRESSES POLICIES
-- Users can manage their own addresses
CREATE POLICY "Users can view their own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

-- ORDERS POLICIES
-- Users can view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders (for status changes like cancellation)
CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- ORDER ITEMS POLICIES
-- Users can view order items for their own orders
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- System can insert order items (via service role)
CREATE POLICY "System can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- WISHLISTS POLICIES
-- Users can manage their own wishlist
CREATE POLICY "Users can view their own wishlist" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items" ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlist items" ON wishlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items" ON wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- CART ITEMS POLICIES
-- Users can manage their own cart items
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- COUPONS POLICIES
-- Anyone can view active coupons (for checkout)
CREATE POLICY "Anyone can view active coupons" ON coupons
  FOR SELECT USING (is_active = true);

-- Only admins can manage coupons (service role only)

-- USED COUPONS POLICIES
-- Users can view their used coupons
CREATE POLICY "Users can view their used coupons" ON used_coupons
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert used coupons (service role)

-- REVIEWS POLICIES
-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Users can view their own reviews
CREATE POLICY "Users can view their own reviews" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own reviews
CREATE POLICY "Users can insert their own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- INVENTORY MOVEMENTS POLICIES
-- Only system/service role can access inventory movements
-- These are managed by triggers and background jobs

-- NEWSLETTER SUBSCRIPTIONS POLICIES
-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

-- Users can view their subscription
CREATE POLICY "Users can view their newsletter subscription" ON newsletter_subscriptions
  FOR SELECT USING (email IN (
    SELECT email FROM auth.users WHERE auth.users.id = auth.uid()
  ));

-- Users can update their subscription
CREATE POLICY "Users can update their newsletter subscription" ON newsletter_subscriptions
  FOR UPDATE USING (email IN (
    SELECT email FROM auth.users WHERE auth.users.id = auth.uid()
  ));

-- ANALYTICS EVENTS POLICIES
-- Users can view their own analytics events
CREATE POLICY "Users can view their own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can insert analytics events (for tracking)
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- PRINTFUL SYNC POLICIES
-- Only service role can manage printful sync (for admin functions)

-- HELPER FUNCTIONS FOR COMMON OPERATIONS

-- Function to get user's profile
CREATE OR REPLACE FUNCTION get_or_create_profile()
RETURNS profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_record profiles;
BEGIN
  -- Try to get existing profile
  SELECT * INTO profile_record
  FROM profiles
  WHERE id = auth.uid();
  
  -- If profile doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO profiles (id, full_name)
    VALUES (
      auth.uid(),
      COALESCE(auth.jwt() ->> 'user_metadata' ->> 'full_name', '')
    )
    RETURNING * INTO profile_record;
  END IF;
  
  RETURN profile_record;
END;
$$;

-- Function to get user's cart with product details
CREATE OR REPLACE FUNCTION get_user_cart()
RETURNS TABLE(
  cart_item_id UUID,
  product_id UUID,
  variant_id UUID,
  quantity INTEGER,
  product_name TEXT,
  product_price DECIMAL,
  variant_size TEXT,
  variant_color TEXT,
  product_image TEXT,
  variant_sku TEXT,
  stock_quantity INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id as cart_item_id,
    p.id as product_id,
    ci.variant_id,
    ci.quantity,
    p.name as product_name,
    COALESCE(pv.price, p.price) as product_price,
    pv.size as variant_size,
    pv.color as variant_color,
    p.images[1] as product_image,
    pv.sku as variant_sku,
    pv.stock_quantity
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  LEFT JOIN product_variants pv ON pv.id = ci.variant_id
  WHERE ci.user_id = auth.uid()
  AND p.is_active = true
  AND (pv.id IS NULL OR pv.is_active = true);
END;
$$;

-- Function to get user's wishlist with product details
CREATE OR REPLACE FUNCTION get_user_wishlist()
RETURNS TABLE(
  wishlist_id UUID,
  product_id UUID,
  variant_id UUID,
  product_name TEXT,
  product_price DECIMAL,
  product_image TEXT,
  product_rating DECIMAL,
  variant_size TEXT,
  variant_color TEXT,
  variant_sku TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id as wishlist_id,
    p.id as product_id,
    w.variant_id,
    p.name as product_name,
    COALESCE(pv.price, p.price) as product_price,
    p.images[1] as product_image,
    p.rating_average,
    pv.size as variant_size,
    pv.color as variant_color,
    pv.sku as variant_sku
  FROM wishlists w
  JOIN products p ON p.id = w.product_id
  LEFT JOIN product_variants pv ON pv.id = w.variant_id
  WHERE w.user_id = auth.uid()
  AND p.is_active = true
  AND (pv.id IS NULL OR pv.is_active = true);
END;
$$;