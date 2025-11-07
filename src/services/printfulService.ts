import { supabase } from '../utils/supabase/client';

export interface PrintfulProduct {
  id: number;
  external_id?: string;
  name: string;
  title?: string;
  description?: string;
  variants: PrintfulVariant[];
  thumbnail_url?: string;
  image_url?: string;
  images?: string[];
  synced: boolean;
  files?: PrintfulFile[];
  options?: PrintfulOption[];
}

export interface PrintfulVariant {
  id: number;
  external_id?: string;
  product_id: number;
  name?: string;
  price: string;
  cost: string;
  in_stock: boolean;
  availability_status?: string;
  currency?: string;
  size?: string;
  color?: string;
  sku?: string;
  stock_status?: string;
  stock_level?: number;
}

export interface PrintfulFile {
  id: number;
  hash: string;
  type: 'preview' | 'print' | 'default';
  title?: string;
  url: string;
  preview_url?: string;
  filename: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  dpi?: number;
  status: 'ok' | 'processing' | 'error';
  created: number;
  thumbnail_url?: string;
}

export interface PrintfulOption {
  id: string;
  value: string | number;
  count?: number;
}

export interface PrintfulOrder {
  id: number;
  external_id?: string;
  name: string;
  shipping: string;
  shipping_type?: string;
  order_date: string;
  address_to: PrintfulAddress;
  address_from: PrintfulAddress;
  status: string;
  is_archived: boolean;
  items: PrintfulOrderItem[];
}

export interface PrintfulAddress {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  state_name?: string;
  country_code: string;
  country_name?: string;
  zip: string;
  phone?: string;
  email?: string;
}

export interface PrintfulOrderItem {
  id: number;
  external_id?: string;
  variant_id: number;
  quantity: number;
  external_variant_id?: string;
  warehouse_product_variant_id: number;
  product_id: number;
  name?: string;
  size?: string;
  color?: string;
  price: string;
  currency: string;
  in_stock: boolean;
}

export interface SyncResult {
  success: boolean;
  message: string;
  data?: {
    products?: number;
    variants?: number;
    errors?: string[];
  };
}

class PrintfulService {
  private baseUrl = 'https://api.printful.com';
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_PRINTFUL_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Printful API key not found. Set VITE_PRINTFUL_API_KEY in your environment variables.');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Printful API key not configured');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Printful API Error: ${response.status} - ${errorData.result || errorData.error?.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Printful API request failed:', error);
      throw error;
    }
  }

  // Sync products from Printful to Supabase
  async syncProducts(): Promise<SyncResult> {
    try {
      console.log('Starting Printful product sync...');
      
      // Get products from Printful
      const response = await this.makeRequest('/store/products');
      const printfulProducts: PrintfulProduct[] = response.result;

      let syncedProducts = 0;
      let syncedVariants = 0;
      const errors: string[] = [];

      for (const printfulProduct of printfulProducts) {
        try {
          // Sync product to Supabase
          const productData = {
            name: printfulProduct.title || printfulProduct.name,
            description: printfulProduct.description,
            price: parseFloat(printfulProduct.variants[0]?.price || '0'),
            sku: printfulProduct.external_id,
            slug: (printfulProduct.title || printfulProduct.name).toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, ''),
            brand: 'KULTZR',
            material: 'Premium Quality',
            images: [printfulProduct.thumbnail_url, ...(printfulProduct.images || [])].filter(Boolean),
            is_active: printfulProduct.synced,
            is_featured: true,
            printful_sync_id: printfulProduct.id.toString(),
            printful_product_id: printfulProduct.id.toString(),
            tags: ['printful', 'streetwear', 'dropship'],
            rating_average: 4.5,
            rating_count: 0,
            total_sold: 0
          };

          // Upsert product
          const { data: product, error: productError } = await supabase
            .from('products')
            .upsert(productData, { onConflict: 'printful_sync_id' })
            .select()
            .single();

          if (productError) {
            throw new Error(`Product upsert failed: ${productError.message}`);
          }

          syncedProducts++;

          // Sync variants
          for (const variant of printfulProduct.variants) {
            try {
              const variantData = {
                product_id: product.id,
                size: variant.size,
                color: variant.color,
                price: parseFloat(variant.price || '0'),
                cost_price: parseFloat(variant.cost || '0'),
                sku: variant.sku || variant.external_id,
                stock_quantity: variant.stock_level || 0,
                is_active: variant.in_stock,
                printful_variant_id: variant.id.toString(),
                printful_sync_id: `${printfulProduct.id}_${variant.id}`
              };

              const { error: variantError } = await supabase
                .from('product_variants')
                .upsert(variantData, { onConflict: 'printful_variant_id' });

              if (variantError) {
                throw new Error(`Variant upsert failed: ${variantError.message}`);
              }

              syncedVariants++;
            } catch (variantError) {
              errors.push(`Variant ${variant.id} error: ${variantError}`);
            }
          }

          // Update sync status
          await supabase
            .from('printful_sync')
            .upsert({
              product_id: product.id,
              printful_product_id: printfulProduct.id.toString(),
              sync_status: 'synced',
              last_sync_at: new Date().toISOString(),
              sync_data: printfulProduct
            }, { onConflict: 'printful_product_id' });

        } catch (productError) {
          errors.push(`Product ${printfulProduct.id} error: ${productError}`);
        }
      }

      return {
        success: true,
        message: `Successfully synced ${syncedProducts} products and ${syncedVariants} variants`,
        data: {
          products: syncedProducts,
          variants: syncedVariants,
          errors: errors.length > 0 ? errors : undefined
        }
      };
    } catch (error) {
      console.error('Printful sync failed:', error);
      return {
        success: false,
        message: `Sync failed: ${error}`,
        data: { errors: [error.toString()] }
      };
    }
  }

  // Create order in Printful
  async createOrder(orderData: {
    external_id?: string;
    recipient: {
      name: string;
      address1: string;
      address2?: string;
      city: string;
      state_code?: string;
      zip: string;
      country_code: string;
      phone?: string;
      email?: string;
    };
    items: {
      variant_id: number;
      quantity: number;
      external_id?: string;
    }[];
  }): Promise<any> {
    try {
      const response = await this.makeRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          external_id: orderData.external_id,
          recipient: orderData.recipient,
          items: orderData.items
        }),
      });

      return response.result;
    } catch (error) {
      console.error('Failed to create Printful order:', error);
      throw error;
    }
  }

  // Get product estimates
  async getProductEstimates(variantIds: number[], quantity: number = 1): Promise<any> {
    try {
      const response = await this.makeRequest('/products/estimates', {
        method: 'POST',
        body: JSON.stringify({
          variant_ids: variantIds,
          quantity
        }),
      });

      return response.result;
    } catch (error) {
      console.error('Failed to get product estimates:', error);
      throw error;
    }
  }

  // Get shipping rates
  async getShippingRates(shippingAddress: any, items: any[]): Promise<any> {
    try {
      const response = await this.makeRequest('/shipping/rates', {
        method: 'POST',
        body: JSON.stringify({
          address_to: shippingAddress,
          items
        }),
      });

      return response.result;
    } catch (error) {
      console.error('Failed to get shipping rates:', error);
      throw error;
    }
  }

  // Get order status
  async getOrderStatus(orderId: number): Promise<any> {
    try {
      const response = await this.makeRequest(`/orders/${orderId}`);
      return response.result;
    } catch (error) {
      console.error('Failed to get order status:', error);
      throw error;
    }
  }

  // Get products from Printful (raw API)
  async getPrintfulProducts(): Promise<PrintfulProduct[]> {
    try {
      const response = await this.makeRequest('/store/products');
      return response.result;
    } catch (error) {
      console.error('Failed to get Printful products:', error);
      throw error;
    }
  }

  // Update product sync status
  async updateSyncStatus(productId: string, status: 'pending' | 'synced' | 'error', error?: string): Promise<void> {
    try {
      await supabase
        .from('printful_sync')
        .update({
          sync_status: status,
          last_sync_at: new Date().toISOString(),
          sync_data: error ? { error } : undefined
        })
        .eq('printful_product_id', productId);
    } catch (error) {
      console.error('Failed to update sync status:', error);
    }
  }

  // Bulk sync all products
  async bulkSync(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    
    try {
      // Full product sync
      const productSync = await this.syncProducts();
      results.push(productSync);

      // Additional operations can be added here
      // e.g., sync categories, update inventory, etc.

    } catch (error) {
      results.push({
        success: false,
        message: `Bulk sync failed: ${error}`,
        data: { errors: [error.toString()] }
      });
    }

    return results;
  }
}

// Export singleton instance
export const printfulService = new PrintfulService();

// Export individual functions for convenience
export const {
  syncProducts,
  createOrder,
  getProductEstimates,
  getShippingRates,
  getOrderStatus,
  getPrintfulProducts,
  bulkSync
} = printfulService;