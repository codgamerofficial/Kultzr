import { useState, useEffect } from 'react';
import { supabase, Product, ProductFilters, PaginatedResponse, toNewProduct } from '../services/supabaseClient';

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
      
      // If no products in database, use mock data for demo
      if (err.message?.includes('relation "products" does not exist')) {
        const mockProducts = [
          {
            id: '1',
            name: 'STEALTH HOODIE',
            price: 4999,
            image: 'https://images.unsplash.com/photo-1629097499121-290fd9a95dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMG1pbmltYWx8ZW58MXx8fHwxNzYyNTIyMzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
            badge: 'NEW',
            rating: 4.8,
            category: 'Hoodies',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['#000000', '#1E1E20', '#6B6B6B'],
            description: 'Premium heavyweight cotton hoodie with embroidered branding. Built for the streets, refined for the culture.'
          },
          {
            id: '2',
            name: 'GHOST RIDER TEE',
            price: 1999,
            image: 'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMHByb2R1Y3R8ZW58MXx8fHwxNzYyNTIyMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            badge: 'LIMITED',
            rating: 4.6,
            category: 'T-Shirts',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['#000000', '#FFFFFF', '#A4FF00'],
            description: 'Limited edition graphic tee. 100% organic cotton. Only 100 pieces made.'
          },
          {
            id: '3',
            name: 'CLOUD WALKER',
            price: 7999,
            image: 'https://images.unsplash.com/photo-1573875133340-0b589f59a8c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwbWluaW1hbHxlbnwxfHx8fDE3NjI0ODgyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.9,
            category: 'Footwear',
            sizes: ['7', '8', '9', '10', '11', '12'],
            colors: ['#FFFFFF', '#F5F5F5'],
            description: 'Ultra-lightweight sneakers with premium leather upper. Engineered for all-day comfort.'
          }
        ];
        
        const transformedProducts = mockProducts.map(p => toNewProduct(p)) as Product[];
        setProducts(transformedProducts);
        setTotalCount(transformedProducts.length);
      }
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
      
      // Fallback to mock data
      const mockProducts = await refreshProducts();
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

// Mobile-specific cart management
export function useMobileCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Add item to cart
  const addToCart = async (product: Product, quantity: number = 1, variantId?: string) => {
    try {
      setIsLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be logged in');
      }

      // Check if item already exists
      const existingItem = cartItems.find(
        item => item.product_id === product.id && item.variant_id === variantId
      );

      if (existingItem) {
        // Update quantity
        await updateCartItem(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            variant_id: variantId,
            quantity
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Update local state
        setCartItems(prev => [...prev, { ...data, product }]);
      }

      await refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      // For demo, add to local storage
      const localCartItem = {
        id: `local_${Date.now()}`,
        product_id: product.id,
        quantity,
        product
      };
      setCartItems(prev => [...prev, localCartItem]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', itemId);

      if (error) {
        throw error;
      }

      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        throw error;
      }

      // Update local state
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      // For demo, just remove from local state
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
      }
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Refresh cart
  const refreshCart = async () => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*),
          variant:product_variants(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setCartItems(data || []);
    } catch (error) {
      console.error('Error refreshing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals
  useEffect(() => {
    const items = cartItems.length;
    const price = cartItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0), 
      0
    );
    
    setTotalItems(items);
    setTotalPrice(price);
  }, [cartItems]);

  return {
    cartItems,
    isLoading,
    totalItems,
    totalPrice,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart
  };
}

// Wishlist management
export function useMobileWishlist() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToWishlist = async (productId: string, variantId?: string) => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be logged in');
      }

      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: productId,
          variant_id: variantId
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setWishlistItems(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // For demo, just add to local state
      const localItem = {
        id: `local_${Date.now()}`,
        product_id: productId,
        variant_id: variantId
      };
      setWishlistItems(prev => [...prev, localItem]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string, variantId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be logged in');
      }

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('variant_id', variantId);

      if (error) {
        throw error;
      }

      // Update local state
      setWishlistItems(prev => 
        prev.filter(item => 
          !(item.product_id === productId && item.variant_id === variantId)
        )
      );
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // For demo, just remove from local state
      setWishlistItems(prev => 
        prev.filter(item => 
          !(item.product_id === productId && item.variant_id === variantId)
        )
      );
    }
  };

  const isInWishlist = (productId: string, variantId?: string) => {
    return wishlistItems.some(item => 
      item.product_id === productId && item.variant_id === variantId
    );
  };

  const refreshWishlist = async () => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          product:products(*),
          variant:product_variants(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error refreshing wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist
  };
}