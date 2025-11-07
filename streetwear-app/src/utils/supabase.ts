import { createClient } from '@supabase/supabase-js'
import { User, Session, AuthError } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Authentication service
export const auth = {
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  signUp: async (email: string, password: string, userData?: any) => {
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: userData
      }
    })
  },
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  getSession: async () => {
    return await supabase.auth.getSession()
  },
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database operations with simplified types
export class DatabaseService {
  // Products
  static async getProducts(filters?: {
    category?: string
    search?: string
    priceMin?: number
    priceMax?: number
    sortBy?: string
    page?: number
    limit?: number
  }) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.priceMin) {
      query = query.gte('price', filters.priceMin)
    }

    if (filters?.priceMax) {
      query = query.lte('price', filters.priceMax)
    }

    // Sorting
    switch (filters?.sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true })
        break
      case 'price-high':
        query = query.order('price', { ascending: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Pagination
    if (filters?.page && filters?.limit) {
      const from = (filters.page - 1) * filters.limit
      const to = from + filters.limit - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }

    return { data, error, count }
  }

  static async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      throw error
    }

    return { data, error }
  }

  static async createProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw error
    }

    return { data, error }
  }

  static async updateProduct(id: string, updates: any) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw error
    }

    return { data, error }
  }

  static async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw error
    }

    return { error }
  }

  // Categories
  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    return { data, error }
  }

  // Orders
  static async createOrder(order: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      throw error
    }

    return { data, error }
  }

  static async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user orders:', error)
      throw error
    }

    return { data, error }
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating order status:', error)
      throw error
    }

    return { data, error }
  }

  // Wishlist
  static async getUserWishlist(userId: string) {
    const { data, error } = await supabase
      .from('wishlists')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching wishlist:', error)
      throw error
    }

    return { data, error }
  }

  static async addToWishlist(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('wishlists')
      .insert({ user_id: userId, product_id: productId })
      .select()
      .single()

    if (error) {
      console.error('Error adding to wishlist:', error)
      throw error
    }

    return { data, error }
  }

  static async removeFromWishlist(userId: string, productId: string) {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) {
      console.error('Error removing from wishlist:', error)
      throw error
    }

    return { error }
  }

  // Analytics (for admin)
  static async getOrderStats() {
    const { data, error } = await supabase
      .from('orders')
      .select('status, total, created_at')
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) {
      console.error('Error fetching order stats:', error)
      throw error
    }

    return { data, error }
  }

  static async getProductStats() {
    const { data, error } = await supabase
      .from('products')
      .select('name, stock_quantity, is_active, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching product stats:', error)
      throw error
    }

    return { data, error }
  }
}

// Real-time subscriptions
export class RealtimeService {
  static subscribeToProducts(callback: (payload: any) => void) {
    return supabase
      .channel('products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        callback
      )
      .subscribe()
  }

  static subscribeToOrders(callback: (payload: any) => void) {
    return supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        callback
      )
      .subscribe()
  }

  static subscribeToInventory(callback: (payload: any) => void) {
    return supabase
      .channel('inventory')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_variants' },
        callback
      )
      .subscribe()
  }
}

// Printful integration service
export class PrintfulService {
  private static apiKey = import.meta.env.VITE_PRINTFUL_API_KEY
  private static baseUrl = 'https://api.printful.com'

  static async syncProducts() {
    try {
      const response = await fetch(`${this.baseUrl}/store/products`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Printful API error: ${response.status}`)
      }

      const data = await response.json()
      
      return data
    } catch (error) {
      console.error('Error syncing with Printful:', error)
      throw error
    }
  }

  static async createPrintfulOrder(order: any) {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      })

      if (!response.ok) {
        throw new Error(`Printful order error: ${response.status}`)
      }

      const data = await response.json()
      
      // Update our order with Printful details if possible
      try {
        await supabase
          .from('orders')
          .update({
            printful_order_id: data.result?.id,
            status: 'processing'
          })
          .eq('id', order.local_order_id)
      } catch (updateError) {
        console.warn('Could not update order with Printful details:', updateError)
      }

      return data
    } catch (error) {
      console.error('Error creating Printful order:', error)
      throw error
    }
  }

  static async getOrderStatus(printfulOrderId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${printfulOrderId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`Printful order status error: ${response.status}`)
      }

      const data = await response.json()
      
      // Update our order status if possible
      try {
        await supabase
          .from('orders')
          .update({
            status: data.result?.status,
            tracking_number: data.result?.tracking_number
          })
          .eq('printful_order_id', printfulOrderId)
      } catch (updateError) {
        console.warn('Could not update order status:', updateError)
      }

      return data
    } catch (error) {
      console.error('Error fetching Printful order status:', error)
      throw error
    }
  }
}

// Payment service
export class PaymentService {
  static async createRazorpayOrder(orderId: string, amount: number) {
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          order_id: orderId,
          amount: amount * 100, // Convert to paise
          currency: 'INR'
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating Razorpay order:', error)
      throw error
    }
  }

  static async createStripePayment(amount: number, currency = 'inr') {
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-payment', {
        body: {
          amount: amount * 100, // Convert to paise
          currency
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating Stripe payment:', error)
      throw error
    }
  }

  static async verifyPayment(paymentId: string, orderId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: {
          payment_id: paymentId,
          order_id: orderId
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }
}

// Export the main services
export const db = DatabaseService
export const subscriptions = RealtimeService
export const printful = PrintfulService
export const payments = PaymentService