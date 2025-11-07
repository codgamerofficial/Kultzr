# KULTZR - Supabase & Printful Integration Setup

## 🗄️ Database Schema

### Tables to Create in Supabase Dashboard

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  printful_id BIGINT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  badge TEXT CHECK (badge IN ('NEW', 'LIMITED', 'DROP', NULL)),
  rating DECIMAL(2,1),
  images JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '[]',
  colors JSONB DEFAULT '[]',
  mockup_images JSONB DEFAULT '[]',
  printful_sync_product_id BIGINT,
  printful_sync_variants JSONB DEFAULT '[]',
  stock_status TEXT DEFAULT 'in_stock',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Product Variants Table (for Printful variants)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  printful_variant_id BIGINT UNIQUE,
  sku TEXT,
  size TEXT,
  color TEXT,
  price DECIMAL(10,2) NOT NULL,
  retail_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  -- Customer Info
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Shipping Address
  shipping_address JSONB NOT NULL,
  
  -- Order Details
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Printful Integration
  printful_order_id TEXT,
  printful_status TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  estimated_delivery_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  default_shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Wishlists Table
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 6. Design Uploads Table (for custom designs to print)
CREATE TABLE design_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  design_name TEXT NOT NULL,
  design_url TEXT NOT NULL,
  thumbnail_url TEXT,
  product_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Printful Webhooks Log
CREATE TABLE printful_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Products: Public read, admin write
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Products are manageable by admins"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Product Variants: Public read
CREATE POLICY "Product variants are viewable by everyone"
  ON product_variants FOR SELECT
  USING (is_available = true);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Profiles: Users can manage their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Wishlists: Users can manage their own wishlist
CREATE POLICY "Users can manage their own wishlist"
  ON wishlists FOR ALL
  USING (auth.uid() = user_id);

-- Design Uploads: Users can view and create their own
CREATE POLICY "Users can view their own designs"
  ON design_uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload designs"
  ON design_uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🪣 Storage Buckets

Create these buckets in Supabase Storage:

1. **product-images** (public)
   - Product photos
   - Mockup images
   - Thumbnail images

2. **design-uploads** (private)
   - User-uploaded custom designs
   - Design previews

3. **order-receipts** (private)
   - Order confirmations
   - Invoices

### Storage Policies

```sql
-- Product Images (Public)
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.jwt() ->> 'role' = 'admin');

-- Design Uploads (Private)
CREATE POLICY "Users can view their own design uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'design-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own designs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'design-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 🔑 Environment Variables

### For Edge Functions (.env)

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Printful API
PRINTFUL_API_KEY=your_printful_api_key
PRINTFUL_STORE_ID=your_store_id

# Optional: Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 📱 Printful Integration Flow

### 1. Sync Products from Printful

```
Admin uploads design → 
Create Printful Sync Product → 
Generate mockups → 
Save to Supabase → 
Display on storefront
```

### 2. Order Flow

```
Customer places order → 
Save to Supabase → 
Create Printful order → 
Printful fulfills → 
Webhook updates status → 
Customer receives tracking
```

### 3. Webhook Events

Printful sends webhooks for:
- `package_shipped` - Update order with tracking
- `package_returned` - Handle returns
- `order_failed` - Alert admin
- `stock_updated` - Sync inventory

---

## 🚀 Next Steps

1. **Run the SQL schema** in Supabase SQL Editor
2. **Create storage buckets** in Supabase Storage
3. **Get Printful API key** from Printful dashboard
4. **Set up webhooks** in Printful to point to your Edge Function
5. **Test the integration** with sample products

---

## 📚 API Endpoints (Edge Functions)

We'll create these endpoints:

- `POST /api/products/sync` - Sync product from Printful
- `GET /api/products` - Get all products
- `POST /api/orders` - Create new order
- `POST /api/orders/:id/fulfill` - Send to Printful
- `POST /api/webhooks/printful` - Handle Printful webhooks
- `POST /api/designs/upload` - Upload custom design
- `GET /api/user/orders` - Get user's orders

---

## 🎯 Admin Dashboard Features

- Upload designs
- Generate mockups via Printful API
- Sync products
- View orders
- Manage inventory
- Track fulfillment status
