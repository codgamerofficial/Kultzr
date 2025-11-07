import { useState, useEffect } from 'react';
import { supabase, Product, ProductFilters, PaginatedResponse } from '../utils/supabase/client';
import { printfulService, SyncResult } from '../services/printfulService';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  refreshProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;
  searchProducts: (filters: ProductFilters) => Promise<PaginatedResponse<Product>>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const refreshProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError, count } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          product_variants(*)
        `, { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const getProduct = async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          product_variants(*)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  };

  const searchProducts = async (filters: ProductFilters): Promise<PaginatedResponse<Product>> => {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          product_variants(*)
        `, { count: 'exact' })
        .eq('is_active', true);

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.category && filters.category !== 'all') {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', filters.category)
          .single();
        
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      if (filters.priceRange) {
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating_average', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: data || [],
        count: count || 0,
        page,
        pageSize: limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (err) {
      console.error('Error searching products:', err);
      throw err;
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    totalCount,
    refreshProducts,
    getProduct,
    searchProducts
  };
}

// Hook for Printful sync operations
export function usePrintfulSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  const syncProducts = async (): Promise<SyncResult> => {
    try {
      setIsSyncing(true);
      toast.loading('Syncing products with Printful...', { id: 'printful-sync' });
      
      const result = await printfulService.syncProducts();
      
      setLastSyncResult(result);
      
      if (result.success) {
        toast.success(
          `Synced ${result.data?.products} products successfully!`,
          { id: 'printful-sync' }
        );
      } else {
        toast.error(
          `Sync failed: ${result.message}`,
          { id: 'printful-sync' }
        );
      }

      return result;
    } catch (error) {
      const result: SyncResult = {
        success: false,
        message: `Sync error: ${error}`,
        data: { errors: [error.toString()] }
      };
      
      setLastSyncResult(result);
      toast.error('Sync failed. Please try again.', { id: 'printful-sync' });
      
      return result;
    } finally {
      setIsSyncing(false);
    }
  };

  const bulkSync = async (): Promise<SyncResult[]> => {
    try {
      setIsSyncing(true);
      toast.loading('Starting bulk sync...', { id: 'bulk-sync' });
      
      const results = await printfulService.bulkSync();
      setLastSyncResult(results[0]);
      
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.length - successCount;
      
      if (successCount > 0) {
        toast.success(
          `Bulk sync completed: ${successCount} successful, ${errorCount} failed`,
          { id: 'bulk-sync' }
        );
      } else {
        toast.error('Bulk sync failed', { id: 'bulk-sync' });
      }
      
      return results;
    } catch (error) {
      toast.error('Bulk sync failed. Please try again.', { id: 'bulk-sync' });
      return [{
        success: false,
        message: `Bulk sync error: ${error}`,
        data: { errors: [error.toString()] }
      }];
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    lastSyncResult,
    syncProducts,
    bulkSync
  };
}

// Hook for product inventory management
export function useProductInventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getInventory = async (productId?: string) => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('product_variants')
        .select(`
          *,
          product:products(name, slug)
        `);

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStock = async (variantId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .update({ 
          stock_quantity: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', variantId);

      if (error) {
        throw error;
      }

      // Update local state
      setInventory(prev => 
        prev.map(item => 
          item.id === variantId 
            ? { ...item, stock_quantity: newStock }
            : item
        )
      );

      toast.success('Stock updated successfully');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const syncInventoryWithPrintful = async (variantId: string) => {
    try {
      // This would integrate with Printful to get real-time stock
      toast.info('Inventory sync feature coming soon');
    } catch (error) {
      console.error('Error syncing inventory:', error);
      toast.error('Failed to sync inventory');
    }
  };

  return {
    inventory,
    isLoading,
    getInventory,
    updateStock,
    syncInventoryWithPrintful
  };
}

// Hook for product management (admin)
export function useProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const { syncProducts } = usePrintfulSync();

  const getAllProducts = async (includeInactive = false) => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          product_variants(*)
        `)
        .order('created_at', { ascending: false });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching all products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const createProduct = async (productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProducts(prev => [data, ...prev]);
      toast.success('Product created successfully');
      
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProducts(prev => 
        prev.map(p => p.id === id ? data : p)
      );
      
      toast.success('Product updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const toggleProductStatus = async (id: string, isActive: boolean) => {
    try {
      await updateProduct(id, { is_active: isActive });
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getCategories();
  }, []);

  return {
    products,
    categories,
    isLoading,
    getAllProducts,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    syncProducts
  };
}
