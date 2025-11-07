# 🚀 Kilo Code Development Prompt: Modern Streetwear Full-Stack Platform

## Project Overview
Build a **complete, production-ready modern streetwear e-commerce platform** with both React website and React Native mobile app, integrated with Supabase backend and Printful dropshipping. Target audience: Gen Z and Millennials (16-28 years) who value authentic street culture, trendy aesthetics, and seamless mobile-first shopping experiences.

---

## 🎯 **Core Architecture & Technology Stack**

### **Frontend Technologies**
```javascript
Web App (React):
- React 18+ with TypeScript
- Vite build tool
- Tailwind CSS 4.0 (custom streetwear design system)
- React Router v6 (SPA routing)
- Framer Motion (animations)
- React Hook Form + Zod (forms)
- Zustand (state management)
- Shadcn/ui + custom components
- React Query/TanStack Query (data fetching)
- Lucide React (icons)

Mobile App (React Native):
- React Native 0.74+ with TypeScript
- Expo SDK 51+ (cross-platform development)
- React Navigation v6 (navigation)
- React Native Reanimated (animations)
- React Hook Form + Zod (forms)
- Expo Linear Gradient (styling)
- AsyncStorage (local storage)
- React Native Elements (UI components)
```

### **Backend & Database**
```javascript
Supabase Stack:
- PostgreSQL database (with RLS)
- Supabase Auth (email, social login)
- Supabase Storage (images, files)
- Edge Functions (Deno runtime)
- Real-time subscriptions
- Row Level Security policies

External Integrations:
- Printful API (dropshipping)
- Razorpay/Stripe (payments)
- SendGrid/Resend (email)
- Cloudinary (image optimization)
```

---

## 🎨 **Design System Implementation**

### **Color Palette (CSS Custom Properties)**
```css
:root {
  /* Primary Colors */
  --street-primary: #0B0B0D;        /* Jet Black */
  --street-secondary: #1E1E20;      /* Charcoal */
  --street-accent: #A4FF00;         /* Electric Lime */
  --street-accent-orange: #FF6A00;  /* Hot Orange */
  --street-white: #FFFFFF;          /* Pure White */
  --street-text: #F5F5F5;          /* White Smoke */
  --street-text-muted: #A8A8A8;     /* Light Gray */
  --street-border: #2A2A2A;         /* Border Gray */
  
  /* Status Colors */
  --street-success: #00FF88;        /* Success Green */
  --street-error: #FF3B3B;          /* Error Red */
  --street-warning: #FFB800;        /* Warning Yellow */
  --street-info: #00D4FF;           /* Info Blue */
  
  /* Gradients */
  --street-gradient-primary: linear-gradient(135deg, #0B0B0D 0%, #1E1E20 100%);
  --street-gradient-accent: linear-gradient(135deg, #A4FF00 0%, #7CCC00 100%);
  --street-gradient-orange: linear-gradient(135deg, #FF6A00 0%, #FF4500 100%);
}
```

### **Typography System**
```css
/* Display Fonts */
.font-display {
  font-family: 'Anton', 'Space Grotesk', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.font-body {
  font-family: 'Inter', 'Poppins', sans-serif;
  font-weight: 400;
  line-height: 1.5;
}

/* Font Sizes */
.text-hero { font-size: clamp(2.5rem, 8vw, 6rem); }
.text-h1 { font-size: clamp(2rem, 6vw, 4rem); }
.text-h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); }
.text-h3 { font-size: 1.875rem; }
.text-body { font-size: 1rem; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
```

### **Component Design System**
```typescript
// Button Variants
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

// Card Components
interface ProductCardProps {
  product: Product;
  variant: 'grid' | 'list';
  showWishlist?: boolean;
  showQuickAdd?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Color Schemes
const colorSchemes = {
  street: {
    primary: '#A4FF00',
    secondary: '#FF6A00',
    neutral: '#0B0B0D',
    surface: '#1E1E20'
  }
};
```

---

## 🌐 **React Web Application Development**

### **Project Structure**
```
streetwear-web/
├── public/
│   ├── icons/                    # App icons
│   ├── images/                   # Static images
│   └── manifest.json            # PWA manifest
├── src/
│   ├── components/
│   │   ├── ui/                  # Shadcn components
│   │   ├── layout/              # Layout components
│   │   ├── product/             # Product components
│   │   ├── cart/                # Cart components
│   │   ├── auth/                # Authentication components
│   │   └── admin/               # Admin components
│   ├── pages/
│   │   ├── Home/                # Landing page
│   │   ├── Products/            # Product catalog
│   │   ├── ProductDetail/       # Single product
│   │   ├── Cart/                # Shopping cart
│   │   ├── Checkout/            # Checkout process
│   │   ├── Profile/             # User profile
│   │   ├── Admin/               # Admin dashboard
│   │   └── Auth/                # Login/Register
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and configs
│   ├── store/                   # Zustand store
│   ├── types/                   # TypeScript definitions
│   └── styles/                  # Global styles
```

### **Core Page Components**

#### **1. Home Page (Landing)**
```typescript
// Home page with modern streetwear hero section
const HomePage = () => {
  return (
    <div className="min-h-screen bg-street-primary">
      <HeroSection />
      <FeaturedCollections />
      <TrendingProducts />
      <StreetCultureStories />
      <NewsletterSignup />
      <SocialProof />
    </div>
  );
};

// Hero Section with street photography
const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/hero-street.jpg" alt="Street Culture" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-street-primary" />
      </div>
      <div className="relative z-10 text-center text-white">
        <h1 className="font-display text-6xl md:text-8xl mb-6">
          STREET<br />
          <span className="text-street-accent">CULTURE</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-street-text-muted">
          Redefining urban fashion. Limited drops. Authentic culture.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-street-accent text-street-primary hover:brightness-110">
            EXPLORE COLLECTION
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-street-primary">
            NEW DROPS
          </Button>
        </div>
      </div>
    </section>
  );
};
```

#### **2. Product Catalog**
```typescript
// Advanced product filtering and search
const ProductCatalog = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    inStock: true
  });
  
  const { data: products, isLoading } = useProducts(filters);
  
  return (
    <div className="min-h-screen bg-street-primary pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <ProductFilters filters={filters} onChange={setFilters} />
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
};

// Product Grid with modern card design
const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant="grid"
          className="group cursor-pointer"
          onProductClick={(p) => navigate(`/products/${p.id}`)}
        />
      ))}
    </div>
  );
};
```

#### **3. Shopping Cart & Checkout**
```typescript
// Modern cart with slide-out panel
const ShoppingCart = () => {
  const { items, total, updateQuantity, removeItem } = useCart();
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-street-secondary p-6">
        <CartHeader onClose={() => navigate('/cart')} />
        <CartItems items={items} onUpdate={updateQuantity} onRemove={removeItem} />
        <CartSummary total={total} />
        <CheckoutButton onClick={() => navigate('/checkout')} />
      </div>
    </div>
  );
};

// Multi-step checkout
const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ['Shipping', 'Payment', 'Review'];
  
  return (
    <div className="min-h-screen bg-street-primary py-20">
      <div className="max-w-4xl mx-auto px-4">
        <ProgressIndicator steps={steps} current={currentStep} />
        <div className="mt-8">
          {currentStep === 1 && <ShippingForm onNext={() => setCurrentStep(2)} />}
          {currentStep === 2 && <PaymentForm onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />}
          {currentStep === 3 && <OrderReview onComplete={handleOrderComplete} onBack={() => setCurrentStep(2)} />}
        </div>
      </div>
    </div>
  );
};
```

---

## 📱 **React Native Mobile App Development**

### **App Structure**
```
streetwear-mobile/
├── app/                        # Expo Router files
│   ├── _layout.tsx            # Root layout
│   ├── index.tsx              # Home screen
│   ├── products/              # Product screens
│   ├── cart/                  # Cart screens
│   ├── checkout/              # Checkout flow
│   ├── profile/               # User profile
│   └── auth/                  # Auth screens
├── components/
│   ├── ui/                    # Reusable components
│   ├── product/               # Product components
│   └── layout/                # Layout components
├── hooks/                     # Custom hooks
├── lib/                       # Utilities
├── store/                     # Zustand store
└── types/                     # TypeScript definitions
```

### **Mobile-Specific Components**

#### **1. Home Screen with Tab Navigation**
```typescript
// Mobile home screen with streetwear aesthetic
const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  return (
    <SafeAreaView className="flex-1 bg-street-primary">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <LinearGradient
        colors={['#0B0B0D', '#1E1E20']}
        className="px-4 py-6"
      >
        <Text className="text-4xl font-bold text-white text-center mb-2">
          STREET
        </Text>
        <Text className="text-4xl font-bold text-street-accent text-center mb-4">
          CULTURE
        </Text>
        <Text className="text-street-text-muted text-center mb-6">
          Redefining urban fashion
        </Text>
        <TouchableOpacity className="bg-street-accent py-3 rounded-lg">
          <Text className="text-street-primary text-center font-bold">
            EXPLORE COLLECTION
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      
      {/* Category Chips */}
      <ScrollView horizontal className="py-4 px-4" showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            className={`px-4 py-2 rounded-full mr-3 ${
              selectedCategory === category 
                ? 'bg-street-accent' 
                : 'bg-street-secondary border border-street-border'
            }`}
            onPress={() => setSelectedCategory(category)}
          >
            <Text className={
              selectedCategory === category 
                ? 'text-street-primary font-semibold'
                : 'text-street-text'
            }>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCardMobile product={item} />
        )}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
```

#### **2. Product Detail Screen**
```typescript
// Mobile product detail with image gallery
const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  return (
    <SafeAreaView className="flex-1 bg-street-primary">
      <ScrollView>
        {/* Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
        >
          {product.images.map((image, index) => (
            <View key={index} style={{ width, height: 400 }}>
              <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
            </View>
          ))}
        </ScrollView>
        
        {/* Image Dots */}
        <View className="flex-row justify-center py-2">
          {product.images.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                currentImageIndex === index ? 'bg-street-accent' : 'bg-street-border'
              }`}
            />
          ))}
        </View>
        
        {/* Product Info */}
        <View className="p-4">
          <Text className="text-2xl font-bold text-white mb-2">{product.name}</Text>
          <Text className="text-street-accent text-xl font-bold mb-4">₹{product.price}</Text>
          
          {/* Size Selection */}
          <View className="mb-4">
            <Text className="text-white font-semibold mb-3">SELECT SIZE</Text>
            <View className="flex-row flex-wrap gap-2">
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  className={`w-12 h-12 border rounded-lg justify-center items-center ${
                    selectedSize === size 
                      ? 'bg-street-accent border-street-accent'
                      : 'border-street-border'
                  }`}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text className={
                    selectedSize === size 
                      ? 'text-street-primary font-bold'
                      : 'text-white'
                  }>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Add to Cart Button */}
          <TouchableOpacity
            className="bg-street-accent py-4 rounded-lg mb-4"
            onPress={handleAddToCart}
          >
            <Text className="text-street-primary text-center font-bold text-lg">
              ADD TO CART
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
```

---

## 🗄️ **Supabase Backend Implementation**

### **Database Schema**
```sql
-- Core e-commerce tables
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  sku TEXT UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id),
  brand TEXT,
  material TEXT,
  care_instructions TEXT,
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  printful_sync_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  color_hex TEXT,
  stock_quantity INTEGER DEFAULT 0,
  price DECIMAL(10,2),
  sku TEXT UNIQUE,
  printful_variant_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  printful_order_id TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  variant_details JSONB
);

CREATE TABLE wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Row Level Security (RLS) Policies**
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products policies (public read for active products)
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Wishlists policies
CREATE POLICY "Users can manage their own wishlist" ON wishlists
  FOR ALL USING (auth.uid() = user_id);
```

### **Edge Functions Implementation**
```typescript
// supabase/functions/server/index.tsx
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { method } = req;
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // API Routes
    switch (method) {
      case 'GET':
        if (path === 'products') {
          const { data: products, error } = await supabaseClient
            .from('products')
            .select(`
              *,
              product_variants(*),
              categories(name, slug)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (error) throw error;
          return new Response(JSON.stringify({ products }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        if (path?.startsWith('products/')) {
          const productId = path.split('/')[1];
          const { data: product, error } = await supabaseClient
            .from('products')
            .select(`
              *,
              product_variants(*),
              categories(name, slug)
            `)
            .eq('id', productId)
            .single();

          if (error) throw error;
          return new Response(JSON.stringify({ product }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'POST':
        if (path === 'orders') {
          const orderData = await req.json();
          const { data: order, error } = await supabaseClient
            .from('orders')
            .insert(orderData)
            .select()
            .single();

          if (error) throw error;
          return new Response(JSON.stringify({ order }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;
    }

    return new Response('Not Found', { status: 404 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

---

## 🛒 **Printful Integration**

### **Product Sync Implementation**
```typescript
// utils/printful.ts
import { supabase } from './supabase/client';

export class PrintfulService {
  private apiKey: string;
  private baseURL = 'https://api.printful.com';

  constructor() {
    this.apiKey = Deno.env.get('PRINTFUL_API_KEY')!;
  }

  async syncProducts() {
    try {
      // Get products from Printful
      const response = await fetch(`${this.baseURL}/store/products`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const { result } = await response.json();

      for (const printfulProduct of result) {
        // Sync each product to Supabase
        await this.syncSingleProduct(printfulProduct);
      }

      return { success: true, synced: result.length };
    } catch (error) {
      console.error('Printful sync error:', error);
      throw error;
    }
  }

  private async syncSingleProduct(printfulProduct: any) {
    const productData = {
      name: printfulProduct.title,
      description: printfulProduct.description,
      price: parseFloat(printfulProduct.variants[0]?.retail_price || '0'),
      sku: printfulProduct.external_id,
      slug: printfulProduct.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      printful_sync_id: printfulProduct.id,
      images: printfulProduct.thumbnail_url ? [printfulProduct.thumbnail_url] : [],
      is_active: printfulProduct.synced,
    };

    // Insert or update product in Supabase
    const { data, error } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'printful_sync_id' })
      .select()
      .single();

    if (error) throw error;

    // Sync variants
    for (const variant of printfulProduct.variants) {
      await this.syncVariant(data.id, variant);
    }
  }

  private async syncVariant(productId: string, variant: any) {
    const variantData = {
      product_id: productId,
      size: variant.size,
      color: variant.color,
      price: parseFloat(variant.retail_price || '0'),
      sku: variant.sku,
      stock_quantity: variant.in_stock ? 999 : 0, // Simplified stock
      printful_variant_id: variant.id,
    };

    await supabase
      .from('product_variants')
      .upsert(variantData, { onConflict: 'printful_variant_id' });
  }

  async createOrder(orderData: any) {
    try {
      const printfulOrder = {
        recipient: {
          name: orderData.shipping_address.name,
          address1: orderData.shipping_address.address,
          city: orderData.shipping_address.city,
          country_code: 'IN', // Adjust based on your location
          zip: orderData.shipping_address.pincode,
          phone: orderData.shipping_address.phone,
          email: orderData.user_email,
        },
        items: orderData.items.map((item: any) => ({
          variant_id: item.printful_variant_id,
          quantity: item.quantity,
          retail_price: item.unit_price,
        )),
      };

      const response = await fetch(`${this.baseURL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printfulOrder),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Printful order creation error:', error);
      throw error;
    }
  }
}
```

---

## 💳 **Payment Integration**

### **Razorpay Integration**
```typescript
// utils/payments/razorpay.ts
export class RazorpayService {
  private keyId: string;
  private keySecret: string;
  private baseURL = 'https://api.razorpay.com/v1';

  constructor() {
    this.keyId = Deno.env.get('RAZORPAY_KEY_ID')!;
    this.keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!;
  }

  async createOrder(amount: number, currency = 'INR') {
    const auth = btoa(`${this.keyId}:${this.keySecret}`);
    
    const response = await fetch(`${this.baseURL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: `order_${Date.now()}`,
      }),
    });

    const order = await response.json();
    return order;
  }

  async verifyPayment(paymentId: string, orderId: string, signature: string) {
    const auth = btoa(`${this.keyId}:${this.keySecret}`);
    const payload = `${orderId}|${paymentId}`;
    
    // Verify signature (implement proper crypto verification)
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }
}
```

---

## 🚀 **State Management & Data Flow**

### **Zustand Store Implementation**
```typescript
// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(
          i => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItem) {
          set({
            items: items.map(i =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            item => !(item.productId === productId && item.variantId === variantId)
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

---

## 🎯 **Key Features Implementation**

### **1. Product Search & Filtering**
```typescript
// hooks/useProductSearch.ts
export const useProductSearch = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    inStock: true,
    sortBy: 'newest'
  });

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    enabled: true,
  });

  return {
    products: products || [],
    isLoading,
    error,
    filters,
    setFilters,
  };
};
```

### **2. User Authentication**
```typescript
// components/auth/AuthProvider.tsx
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### **3. Real-time Features**
```typescript
// hooks/useRealtimeProducts.ts
export const useRealtimeProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch initial products
    fetchProducts().then(setProducts);

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts((prev) => [...prev, payload.new as Product]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts((prev) =>
              prev.map((product) =>
                product.id === payload.new.id ? (payload.new as Product) : product
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setProducts((prev) =>
              prev.filter((product) => product.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return products;
};
```

---

## 📱 **Mobile-Specific Features**

### **Push Notifications**
```typescript
// utils/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export class NotificationService {
  async registerForPushNotifications() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  async scheduleLocalNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  }
}
```

### **Biometric Authentication**
```typescript
// utils/biometrics.ts
import * as LocalAuthentication from 'expo-local-authentication';

export class BiometricService {
  async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  async authenticate(): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access your account',
      fallbackLabel: 'Use password instead',
    });

    return result.success;
  }
}
```

---

## 🔧 **Performance Optimization**

### **Image Optimization**
```typescript
// components/OptimizedImage.tsx
export const OptimizedImage = ({ 
  src, 
  alt, 
  className,
  ...props 
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-street-secondary animate-pulse" />
      )}
      {!error && (
        <img
          src={`${src}?w=400&h=400&fit=crop&auto=format`}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          {...props}
        />
      )}
      {error && (
        <div className="absolute inset-0 bg-street-secondary flex items-center justify-center">
          <Text className="text-street-text-muted">Image failed to load</Text>
        </div>
      )}
    </div>
  );
};
```

### **Lazy Loading & Code Splitting**
```typescript
// App.tsx - React.lazy for components
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/products/:id" element={<ProductDetail />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>
```

---

## 🧪 **Testing Strategy**

### **Unit Tests with Jest**
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Street Hoodie',
  price: 2999,
  image: '/test-image.jpg',
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Street Hoodie')).toBeInTheDocument();
    expect(screen.getByText('₹2,999')).toBeInTheDocument();
  });

  it('calls onAddToCart when add button is clicked', () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

### **E2E Tests with Cypress**
```typescript
// cypress/e2e/shopping-flow.cy.ts
describe('Shopping Flow', () => {
  it('should complete a purchase', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="checkout-button"]').click();
    cy.get('[data-testid="shipping-form"]').type('Test Address');
    cy.get('[data-testid="place-order"]').click();
    cy.contains('Order confirmed').should('be.visible');
  });
});
```

---

## 🚀 **Deployment & DevOps**

### **CI/CD Pipeline (GitHub Actions)**
```yaml
# .github/workflows/deploy.yml
name: Deploy Streetwear Platform

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build web app
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-mobile:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Install dependencies
        run: cd kultzr-mobile && npm ci
      - name: Build mobile app
        run: |
          cd kultzr-mobile
          eas build --profile production --platform all --non-interactive
      - name: Submit to stores
        run: |
          cd kultzr-mobile
          eas submit --profile production --platform all --non-interactive
```

---

## 📊 **Analytics & Monitoring**

### **Custom Analytics Hook**
```typescript
// hooks/useAnalytics.ts
export const useAnalytics = () => {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // Send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties);
    }
    
    // Send to your custom analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, properties, timestamp: Date.now() }),
    });
  };

  const trackPageView = (page: string) => {
    trackEvent('page_view', { page });
  };

  const trackPurchase = (orderData: any) => {
    trackEvent('purchase', {
      transaction_id: orderData.id,
      value: orderData.total_amount,
      currency: 'INR',
      items: orderData.items,
    });
  };

  return { trackEvent, trackPageView, trackPurchase };
};
```

---

## 🎯 **Final Implementation Checklist**

### **Phase 1: Core Platform (Week 1-2)**
- [ ] Set up project structure for both web and mobile
- [ ] Implement Supabase database with RLS policies
- [ ] Build authentication system
- [ ] Create product catalog with filtering
- [ ] Implement shopping cart functionality
- [ ] Basic checkout flow

### **Phase 2: E-commerce Features (Week 3-4)**
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Order management system
- [ ] User profile and order history
- [ ] Admin dashboard for product management
- [ ] Printful integration for dropshipping
- [ ] Email notifications

### **Phase 3: Mobile App (Week 5-6)**
- [ ] React Native app structure
- [ ] Mobile-specific UI components
- [ ] Native navigation and routing
- [ ] Mobile payment integration
- [ ] Push notifications
- [ ] App store deployment

### **Phase 4: Polish & Launch (Week 7-8)**
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Testing (unit, integration, e2e)
- [ ] Security audit
- [ ] Production deployment
- [ ] Monitoring and analytics setup

---

## 💡 **Pro Tips for Success**

### **Design & UX**
1. **Mobile-First**: Always design and test on mobile first
2. **Street Culture**: Use authentic street photography and urban aesthetics
3. **Fast Loading**: Optimize images and implement lazy loading
4. **Smooth Animations**: Use Framer Motion for delightful interactions

### **Development Best Practices**
1. **Type Safety**: Use TypeScript throughout the entire stack
2. **Component Library**: Build reusable components for consistency
3. **State Management**: Keep global state minimal, use React Query for server state
4. **Error Handling**: Implement comprehensive error boundaries and fallbacks

### **Performance**
1. **Image Optimization**: Use WebP format and responsive images
2. **Code Splitting**: Implement dynamic imports for better performance
3. **Caching**: Use React Query for intelligent data caching
4. **CDN**: Use Supabase Storage or Cloudinary for asset delivery

### **Business Features**
1. **A/B Testing**: Implement feature flags for gradual rollouts
2. **Analytics**: Track user behavior and conversion funnels
3. **SEO**: Implement proper meta tags and structured data
4. **Social Proof**: Add reviews, testimonials, and user-generated content

---

## 🎉 **Ready to Build Your Streetwear Empire!**

This comprehensive prompt provides everything needed to build a modern, fully-functional streetwear e-commerce platform that rivals major brands. The combination of React web app, React Native mobile app, Supabase backend, and Printful integration creates a complete solution that can scale from startup to enterprise level.

**Your platform will feature:**
✅ **Modern streetwear aesthetic** appealing to Gen Z/Millennials  
✅ **Mobile-first design** with native app experience  
✅ **Complete e-commerce functionality** with payment processing  
✅ **Dropshipping integration** via Printful for zero inventory  
✅ **Real-time features** for live inventory and order tracking  
✅ **Admin dashboard** for complete business management  
✅ **Production-ready deployment** with CI/CD pipeline  
✅ **Performance optimized** for fast loading and smooth UX  
✅ **Scalable architecture** that grows with your business  

**Go forth and build something amazing! 🚀👑**