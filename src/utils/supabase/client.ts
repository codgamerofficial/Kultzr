import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Singleton Supabase client for web
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = `https://${projectId}.supabase.co`;
  
  supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return supabaseClient;
}

// Export singleton instance
export const supabase = createClient();

// Database Types
export interface Product {
  id: string;
  printful_id?: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  badge?: 'NEW' | 'LIMITED' | 'DROP';
  rating?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  mockup_images: string[];
  printful_sync_product_id?: number;
  printful_sync_variants: any[];
  stock_status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  printful_variant_id?: number;
  sku?: string;
  size?: string;
  color?: string;
  price: number;
  retail_price?: number;
  stock_quantity: number;
  is_available: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: {
    address: string;
    city: string;
    state?: string;
    pincode: string;
    country: string;
  };
  items: Array<{
    product_id: string;
    variant_id?: string;
    name: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  printful_order_id?: string;
  printful_status?: string;
  tracking_number?: string;
  tracking_url?: string;
  estimated_delivery_date?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  default_shipping_address?: any;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface DesignUpload {
  id: string;
  user_id?: string;
  design_name: string;
  design_url: string;
  thumbnail_url?: string;
  product_type?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
