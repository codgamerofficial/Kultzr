import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { projectId, publicAnonKey } from './info';

// Singleton Supabase client for mobile
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = `https://${projectId}.supabase.co`;
  
  supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey, {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'pkce'
    }
  });

  return supabaseClient;
}

// Export singleton instance
export const supabase = createClient();

// Database Types (same as web app)
export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences?: Record<string, any>;
  loyalty_points: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

// Legacy Product interface (from App.tsx) for backward compatibility
export interface LegacyProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: 'NEW' | 'LIMITED' | 'DROP';
  rating?: number;
  category?: string;
  sizes?: string[];
  colors?: string[];
  description?: string;
  is_active?: boolean;
  total_sold?: number;
}

// Updated Product interface with complete database schema
export interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  sku?: string;
  slug: string;
  category_id?: string;
  brand?: string;
  material?: string;
  care_instructions?: string;
  weight?: number;
  dimensions?: Record<string, any>;
  images: string[];
  gallery_images?: string[];
  is_active: boolean;
  is_featured: boolean;
  is_digital: boolean;
  track_inventory: boolean;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  rating_average: number;
  rating_count: number;
  total_sold: number;
  printful_sync_id?: string;
  printful_product_id?: string;
  created_at: string;
  updated_at: string;
  
  // Legacy compatibility properties
  badge?: 'NEW' | 'LIMITED' | 'DROP';
  category?: string;
  sizes?: string[];
  colors?: string[];
  rating?: number;
  image?: string;
  
  // Relations
  category?: Category;
  product_variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size?: string;
  color?: string;
  color_hex?: string;
  material?: string;
  stock_quantity: number;
  reserved_quantity: number;
  price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: Record<string, any>;
  image_url?: string;
  is_active: boolean;
  printful_variant_id?: string;
  printful_sync_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  fulfillment_status: 'unfulfilled' | 'partial' | 'fulfilled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  
  // Order amounts
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  
  // Currency
  currency: string;
  
  // Shipping information
  shipping_address: Record<string, any>;
  billing_address: Record<string, any>;
  shipping_method?: string;
  shipping_tracking_number?: string;
  
  // Payment information
  payment_method?: string;
  payment_gateway?: 'razorpay' | 'stripe' | 'cod';
  payment_gateway_order_id?: string;
  payment_id?: string;
  
  // Additional information
  notes?: string;
  customer_notes?: string;
  
  // Timestamps
  order_date: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string;
  variant_details?: Record<string, any>;
  product_sku?: string;
  variant_sku?: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithDetails extends CartItem {
  product: Product;
  variant?: ProductVariant;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  variant_id?: string;
  notes?: string;
  created_at: string;
}

// Auth types
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: AuthUser;
}

// Filter types for products
export interface ProductFilters {
  search?: string;
  category?: string;
  priceRange?: [number, number];
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Utility type for converting legacy product to new format
export function toNewProduct(legacy: LegacyProduct): Partial<Product> {
  return {
    id: legacy.id,
    name: legacy.name,
    price: legacy.price,
    slug: legacy.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    images: legacy.image ? [legacy.image] : [],
    is_active: legacy.is_active ?? true,
    is_featured: false,
    is_digital: false,
    track_inventory: true,
    rating_average: legacy.rating ?? 0,
    rating_count: 0,
    total_sold: legacy.total_sold ?? 0,
    // Legacy compatibility
    badge: legacy.badge,
    category: legacy.category,
    sizes: legacy.sizes,
    colors: legacy.colors,
    rating: legacy.rating,
    image: legacy.image
  };
}