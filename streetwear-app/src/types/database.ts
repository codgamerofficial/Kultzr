export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          phone?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description?: string
          price: number
          compare_at_price?: number
          sku: string
          slug: string
          category_id: string
          brand?: string
          material?: string
          care_instructions?: string
          images: string[]
          is_active: boolean
          is_featured: boolean
          printful_sync_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          price: number
          compare_at_price?: number
          sku: string
          slug: string
          category_id: string
          brand?: string
          material?: string
          care_instructions?: string
          images: string[]
          is_active?: boolean
          is_featured?: boolean
          printful_sync_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          compare_at_price?: number
          sku?: string
          slug?: string
          category_id?: string
          brand?: string
          material?: string
          care_instructions?: string
          images?: string[]
          is_active?: boolean
          is_featured?: boolean
          printful_sync_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description?: string
          image_url?: string
          parent_id?: string
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          image_url?: string
          parent_id?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          image_url?: string
          parent_id?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          subtotal: number
          tax_amount: number
          shipping_amount: number
          shipping_address: any
          billing_address: any
          payment_method?: string
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          printful_order_id?: string
          tracking_number?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          subtotal: number
          tax_amount?: number
          shipping_amount?: number
          shipping_address: any
          billing_address: any
          payment_method?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          printful_order_id?: string
          tracking_number?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount?: number
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          shipping_address?: any
          billing_address?: any
          payment_method?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          printful_order_id?: string
          tracking_number?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}