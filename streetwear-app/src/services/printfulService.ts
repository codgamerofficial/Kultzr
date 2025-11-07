import { supabase } from '../utils/supabase'

export interface PrintfulProduct {
  id: number
  external_id: string
  name: string
  variants: PrintfulVariant[]
  files: PrintfulFile[]
  thumbnail: string
  is_ignored: boolean
  tracking_needed: boolean
  description?: string
}

export interface PrintfulVariant {
  id: number
  external_id: string
  variant_id: number
  files: PrintfulFile[]
  options: PrintfulOption[]
  quantity: number
  retail_price: string
  sku: string
}

export interface PrintfulFile {
  id: number
  hash: string
  type: 'default' | 'preview' | 'preview_back' | 'printfile'
  hash_type: string
  width: number
  height: number
  dpi: number
  status: 'ok' | 'processing'
  created: number
  thumbnail_url: string
  preview_url: string
  url: string
}

export interface PrintfulOption {
  id: string
  value: string
}

export interface PrintfulOrder {
  id: number
  external_id?: string
  status: 'draft' | 'pending' | 'failed' | 'canceled' | 'on_hold' | 'sent_to_production' | 'in_production' | 'in_decoration' | 'waiting_to_be_shipped' | 'partial' | 'shipped' | 'delivered' | 'returned' | 'canceled_by_admin'
  shipping: PrintfulShipping
  recipient: PrintfulRecipient
  items: PrintfulOrderItem[]
  external_costs?: string
  retail_costs?: string
  shipping_costs?: string
  tax?: string
  shipping_tax?: string
  created: number
  updated: number
  is_archived: boolean
}

export interface PrintfulShipping {
  name: string
  carrier: string
  service: string
  service_id: number
}

export interface PrintfulRecipient {
  name: string
  address1: string
  city: string
  state_code: string
  country_code: string
  zip: string
  phone?: string
  email?: string
}

export interface PrintfulOrderItem {
  variant_id: number
  quantity: number
  external_id?: string
  name: string
  retail_price: string
}

export interface SyncResult {
  success: boolean
  products_synced?: number
  products_updated?: number
  products_created?: number
  error?: string
}

export class PrintfulService {
  private apiKey: string
  private baseUrl: string = 'https://api.printful.com'

  constructor() {
    this.apiKey = import.meta.env.VITE_PRINTFUL_API_KEY || ''
    if (!this.apiKey) {
      console.warn('Printful API key not found. Please set VITE_PRINTFUL_API_KEY in your environment variables.')
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Printful API error (${response.status}): ${errorText}`)
    }

    return response.json()
  }

  // Sync products from Printful
  async syncProducts(): Promise<SyncResult> {
    try {
      // Get products from Printful
      const productsResponse = await this.makeRequest('/store/products')
      const printfulProducts: PrintfulProduct[] = productsResponse.result || []

      let productsCreated = 0
      let productsUpdated = 0

      for (const product of printfulProducts) {
        // Check if product already exists
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('printful_id', product.id.toString())
          .single()

        if (existingProduct) {
          // Update existing product
          await this.updateProductFromPrintful(product, existingProduct.id)
          productsUpdated++
        } else {
          // Create new product
          await this.createProductFromPrintful(product)
          productsCreated++
        }
      }

      // Update sync metadata
      await supabase
        .from('sync_metadata')
        .upsert({
          service: 'printful',
          last_sync: new Date().toISOString(),
          sync_count: printfulProducts.length,
          success: true
        })

      return {
        success: true,
        products_synced: printfulProducts.length,
        products_created: productsCreated,
        products_updated: productsUpdated
      }
    } catch (error) {
      console.error('Error syncing Printful products:', error)
      
      // Update sync metadata with error
      await supabase
        .from('sync_metadata')
        .upsert({
          service: 'printful',
          last_sync: new Date().toISOString(),
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Create product from Printful data
  private async createProductFromPrintful(printfulProduct: PrintfulProduct): Promise<void> {
    const primaryVariant = printfulProduct.variants[0]
    
    const productData = {
      name: printfulProduct.name,
      slug: printfulProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: printfulProduct.description || '',
      price: parseFloat(primaryVariant?.retail_price || '0'),
      compare_at_price: null,
      image_url: printfulProduct.thumbnail,
      images: [printfulProduct.thumbnail],
      category: this.inferCategory(printfulProduct.name),
      stock_quantity: 0,
      is_active: !printfulProduct.is_ignored,
      printful_id: printfulProduct.id.toString(),
      printful_sync_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (productError) {
      throw productError
    }

    // Create product variants
    if (printfulProduct.variants.length > 0) {
      const variants = printfulProduct.variants.map(variant => ({
        product_id: product.id,
        sku: variant.sku || `PRINTFUL-${variant.id}`,
        price: parseFloat(variant.retail_price),
        compare_at_price: null,
        size: this.extractSize(variant.options),
        color: this.extractColor(variant.options),
        stock_quantity: variant.quantity,
        is_active: true,
        printful_variant_id: variant.id.toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variants)

      if (variantError) {
        console.warn('Error creating product variants:', variantError)
      }
    }
  }

  // Update existing product from Printful
  private async updateProductFromPrintful(printfulProduct: PrintfulProduct, productId: string): Promise<void> {
    const primaryVariant = printfulProduct.variants[0]
    
    const updateData = {
      name: printfulProduct.name,
      description: printfulProduct.description || '',
      price: parseFloat(primaryVariant?.retail_price || '0'),
      image_url: printfulProduct.thumbnail,
      is_active: !printfulProduct.is_ignored,
      updated_at: new Date().toISOString()
    }

    const { error: productError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)

    if (productError) {
      throw productError
    }
  }

  // Create order in Printful
  async createOrder(orderData: any): Promise<any> {
    try {
      const printfulOrder = {
        external_id: orderData.id.toString(),
        recipient: {
          name: orderData.shipping_name,
          address1: orderData.shipping_address,
          city: orderData.shipping_city,
          state_code: orderData.shipping_state,
          country_code: 'IN', // Assuming India for now
          zip: orderData.shipping_pincode,
          phone: orderData.shipping_phone,
          email: orderData.user_email
        },
        items: await this.formatOrderItems(orderData.items),
        shipping: {
          name: 'STANDARD',
          carrier: 'printful',
          service: 'STANDARD'
        }
      }

      const response = await this.makeRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(printfulOrder)
      })

      // Update our order with Printful order ID
      await supabase
        .from('orders')
        .update({
          printful_order_id: response.result.id.toString(),
          status: 'processing'
        })
        .eq('id', orderData.id)

      return response
    } catch (error) {
      console.error('Error creating Printful order:', error)
      throw error
    }
  }

  // Get order status from Printful
  async getOrderStatus(printfulOrderId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/orders/${printfulOrderId}`)
      return response.result
    } catch (error) {
      console.error('Error getting Printful order status:', error)
      throw error
    }
  }

  // Track order
  async trackOrder(printfulOrderId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/orders/${printfulOrderId}/tracking`)
      return response.result
    } catch (error) {
      console.error('Error tracking Printful order:', error)
      throw error
    }
  }

  // Helper methods
  private async formatOrderItems(orderItems: any[]): Promise<any[]> {
    const items = []
    
    for (const item of orderItems) {
      // Get the Printful variant ID from our product
      const { data: variant } = await supabase
        .from('product_variants')
        .select('printful_variant_id, sku')
        .eq('product_id', item.product_id)
        .eq('size', item.selected_size || '')
        .single()

      if (variant?.printful_variant_id) {
        items.push({
          variant_id: parseInt(variant.printful_variant_id),
          quantity: item.quantity,
          external_id: item.id.toString()
        })
      }
    }

    return items
  }

  private inferCategory(productName: string): string {
    const name = productName.toLowerCase()
    if (name.includes('hoodie') || name.includes('sweatshirt')) return 'Hoodies'
    if (name.includes('t-shirt') || name.includes('tee') || name.includes('tshirt')) return 'T-Shirts'
    if (name.includes('jacket') || name.includes('coat')) return 'Jackets'
    if (name.includes('pants') || name.includes('jeans') || name.includes('trouser')) return 'Bottoms'
    if (name.includes('cap') || name.includes('hat')) return 'Accessories'
    return 'Accessories'
  }

  private extractSize(options: PrintfulOption[]): string {
    const sizeOption = options.find(opt => 
      opt.id === 'size' || opt.id === 'Size' || opt.id === 'SIZE'
    )
    return sizeOption?.value || ''
  }

  private extractColor(options: PrintfulOption[]): string {
    const colorOption = options.find(opt => 
      opt.id === 'color' || opt.id === 'Color' || opt.id === 'COLOR'
    )
    return colorOption?.value || ''
  }

  // Sync all orders to update their status
  async syncOrderStatuses(): Promise<void> {
    try {
      // Get orders that have Printful order IDs
      const { data: orders } = await supabase
        .from('orders')
        .select('id, printful_order_id, status')
        .not('printful_order_id', 'is', null)

      for (const order of orders || []) {
        try {
          const printfulOrder = await this.getOrderStatus(order.printful_order_id)
          
          // Update order status based on Printful status
          const newStatus = this.mapPrintfulStatus(printfulOrder.status)
          
          if (newStatus !== order.status) {
            await supabase
              .from('orders')
              .update({ 
                status: newStatus,
                updated_at: new Date().toISOString()
              })
              .eq('id', order.id)

            // If shipped, update tracking information
            if (newStatus === 'shipped' && printfulOrder.tracking_number) {
              await supabase
                .from('orders')
                .update({
                  tracking_number: printfulOrder.tracking_number,
                  tracking_url: printfulOrder.tracking_url
                })
                .eq('id', order.id)
            }
          }
        } catch (error) {
          console.error(`Error syncing order ${order.id}:`, error)
        }
      }
    } catch (error) {
      console.error('Error syncing order statuses:', error)
    }
  }

  private mapPrintfulStatus(printfulStatus: string): string {
    switch (printfulStatus) {
      case 'draft': return 'draft'
      case 'pending': return 'pending'
      case 'on_hold': return 'on_hold'
      case 'sent_to_production':
      case 'in_production':
      case 'in_decoration': return 'processing'
      case 'waiting_to_be_shipped': return 'ready_to_ship'
      case 'shipped': return 'shipped'
      case 'delivered': return 'delivered'
      case 'returned': return 'returned'
      case 'failed':
      case 'canceled':
      case 'canceled_by_admin': return 'cancelled'
      default: return 'pending'
    }
  }

  // Get sync status
  async getSyncStatus(): Promise<any> {
    const { data } = await supabase
      .from('sync_metadata')
      .select('*')
      .eq('service', 'printful')
      .single()

    return data
  }
}

// Export singleton instance
export const printfulService = new PrintfulService()