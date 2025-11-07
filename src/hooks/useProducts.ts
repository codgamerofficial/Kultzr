import { useState, useEffect } from 'react';
import { supabase, Product as SupabaseProduct } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

// Map Supabase product to app product format
function mapProduct(dbProduct: SupabaseProduct): any {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    image: dbProduct.images?.[0] || '',
    badge: dbProduct.badge,
    rating: dbProduct.rating || undefined,
    category: dbProduct.category || undefined,
    sizes: dbProduct.sizes || [],
    colors: dbProduct.colors || [],
    description: dbProduct.description || ''
  };
}

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching products from Supabase:', fetchError);
        setUseMockData(true);
        loadMockProducts();
        return;
      }

      if (data && data.length > 0) {
        setProducts(data.map(mapProduct));
        setUseMockData(false);
      } else {
        // No products in database, use mock data
        console.log('No products in database, using mock data');
        setUseMockData(true);
        loadMockProducts();
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError(String(err));
      setUseMockData(true);
      loadMockProducts();
    } finally {
      setLoading(false);
    }
  }

  function loadMockProducts() {
    // Mock data for demonstration
    setProducts([
      {
        id: '1',
        name: 'STEALTH HOODIE',
        price: 4999,
        image: 'https://images.unsplash.com/photo-1629097499121-290fd9a95dee?w=800',
        badge: 'NEW',
        rating: 4.8,
        category: 'Hoodies',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['#000000', '#1E1E20', '#6B6B6B'],
        description: 'Premium heavyweight cotton hoodie with embroidered branding.'
      },
      {
        id: '2',
        name: 'GHOST RIDER TEE',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?w=800',
        badge: 'LIMITED',
        rating: 4.6,
        category: 'T-Shirts',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#000000', '#FFFFFF', '#A4FF00'],
        description: 'Limited edition graphic tee. 100% organic cotton.'
      },
      {
        id: '3',
        name: 'CLOUD WALKER',
        price: 7999,
        image: 'https://images.unsplash.com/photo-1573875133340-0b589f59a8c4?w=800',
        rating: 4.9,
        category: 'Footwear',
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['#FFFFFF', '#F5F5F5'],
        description: 'Ultra-lightweight sneakers with premium leather upper.'
      },
      {
        id: '4',
        name: 'URBAN DENIM',
        price: 5499,
        image: 'https://images.unsplash.com/photo-1602585198422-d795fa9bfd6f?w=800',
        rating: 4.7,
        category: 'Bottoms',
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['#4A5568', '#2D3748'],
        description: 'Slim-fit denim with stretch. Japanese fabric.'
      },
      {
        id: '5',
        name: 'NIGHT BOMBER',
        price: 8999,
        image: 'https://images.unsplash.com/photo-1760126070359-5b82710274fe?w=800',
        badge: 'DROP',
        rating: 4.8,
        category: 'Jackets',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#000000', '#1E1E20'],
        description: 'MA-1 inspired bomber jacket. Water-resistant nylon.'
      },
      {
        id: '6',
        name: 'FUTURE CAP',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1609109828990-5487fd36a798?w=800',
        rating: 4.5,
        category: 'Accessories',
        sizes: ['One Size'],
        colors: ['#000000', '#A4FF00'],
        description: '6-panel structured cap. Embroidered logo.'
      },
      {
        id: '7',
        name: 'VOID BACKPACK',
        price: 6499,
        image: 'https://images.unsplash.com/photo-1747930506213-748c5b8f8e93?w=800',
        badge: 'NEW',
        rating: 4.9,
        category: 'Accessories',
        sizes: ['One Size'],
        colors: ['#000000'],
        description: '30L capacity. Laptop sleeve. Water-resistant.'
      },
      {
        id: '8',
        name: 'REBEL HOODIE',
        price: 5499,
        image: 'https://images.unsplash.com/photo-1635650805015-2fa50682873a?w=800',
        rating: 4.7,
        category: 'Hoodies',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#000000', '#6B6B6B', '#A4FF00'],
        description: 'Oversized fit hoodie. French terry cotton.'
      }
    ]);
  }

  return {
    products,
    loading,
    error,
    useMockData,
    refetch: loadProducts
  };
}
