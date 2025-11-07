import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, Category, ProductFilters } from '../types'
import { db, subscriptions } from '../utils/supabase'
import toast from 'react-hot-toast'

interface ProductContextType {
  products: Product[]
  categories: Category[]
  filters: ProductFilters
  loading: boolean
  error: string | null
  totalProducts: number
  setFilters: (filters: Partial<ProductFilters>) => void
  resetFilters: () => void
  searchProducts: (query: string) => void
  getProductBySlug: (slug: string) => Product | null
  refetchProducts: () => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

// Mock data for development
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'STREET HOODIE',
    description: 'Premium heavyweight cotton hoodie with embroidered branding. Built for the streets, refined for the culture.',
    price: 4999,
    compareAtPrice: 5999,
    images: [
      'https://images.unsplash.com/photo-1629097499121-290fd9a95dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMG1pbmltYWx8ZW58MXx8fHwxNzYyNTIyMzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBob29kaWV8ZW58MXx8fHwxNzYyNTIyMzI1fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    category: 'Hoodies',
    brand: 'STREET CULTURE',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#000000', '#1E1E20', '#6B6B6B'],
    material: '100% Cotton',
    sku: 'SC-H001',
    slug: 'street-hoodie',
    stockQuantity: 50,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'URBAN TEE',
    description: 'Limited edition graphic tee. 100% organic cotton. Only 100 pieces made.',
    price: 1999,
    images: [
      'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMHByb2R1Y3R8ZW58MXx8fHwxNzYyNTIyMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1583743089696-4b1b3b0b2b6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwdHNoaXJ0fGVufDF8fHx8MTc2MjU2MDU0NHww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    category: 'T-Shirts',
    brand: 'STREET CULTURE',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#FFFFFF', '#A4FF00'],
    material: '100% Organic Cotton',
    sku: 'SC-T001',
    slug: 'urban-tee',
    stockQuantity: 25,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    name: 'NIGHT BOMBER',
    description: 'MA-1 inspired bomber jacket. Water-resistant nylon shell. Limited drop.',
    price: 8999,
    images: [
      'https://images.unsplash.com/photo-1760126070359-5b82710274fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib21iZXIlMjBqYWNrZXQlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc2MjQ5MTIxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1566479179817-c0c82c05a4c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXZ5JTIwamFja2V0fGVufDF8fHx8MTc2MjQ5MTIxN3ww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    category: 'Jackets',
    brand: 'STREET CULTURE',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#1E1E20'],
    material: 'Nylon Shell, Polyester Lining',
    sku: 'SC-J001',
    slug: 'night-bomber',
    stockQuantity: 15,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  }
]

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Premium streetwear hoodies',
    sortOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Graphic tees and basics',
    sortOrder: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Jackets',
    slug: 'jackets',
    description: 'Urban outerwear',
    sortOrder: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
]

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [filters, setFiltersState] = useState<ProductFilters>({
    sortBy: 'newest',
    page: 1,
    limit: 20
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const totalProducts = products.length

  useEffect(() => {
    // Load real products from Supabase
    fetchProducts()
    
    // Set up real-time subscription
    const subscription = subscriptions.subscribeToProducts((payload) => {
      console.log('Product update:', payload)
      fetchProducts()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // For now, use mock data
      // In production, uncomment this:
      // const { data, error } = await db.getProducts(filters)
      // if (error) throw error
      // setProducts(data || [])

      setProducts(MOCK_PRODUCTS)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products')
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const setFilters = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFiltersState(updatedFilters)
    fetchProductsWithFilters(updatedFilters)
  }

  const fetchProductsWithFilters = async (currentFilters: ProductFilters) => {
    try {
      setLoading(true)
      // Apply filters to mock data
      let filteredProducts = [...MOCK_PRODUCTS]

      if (currentFilters.search) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(currentFilters.search!.toLowerCase()) ||
          product.description.toLowerCase().includes(currentFilters.search!.toLowerCase())
        )
      }

      if (currentFilters.category) {
        filteredProducts = filteredProducts.filter(product =>
          product.category.toLowerCase() === currentFilters.category!.toLowerCase()
        )
      }

      if (currentFilters.priceMin) {
        filteredProducts = filteredProducts.filter(product =>
          product.price >= currentFilters.priceMin!
        )
      }

      if (currentFilters.priceMax) {
        filteredProducts = filteredProducts.filter(product =>
          product.price <= currentFilters.priceMax!
        )
      }

      // Sort products
      switch (currentFilters.sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'popular':
          // In a real app, this would sort by popularity/purchase count
          filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
          break
        default: // newest
          filteredProducts.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      }

      setProducts(filteredProducts)
    } catch (err) {
      console.error('Error fetching filtered products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFiltersState({
      sortBy: 'newest',
      page: 1,
      limit: 20
    })
    setProducts(MOCK_PRODUCTS)
  }

  const searchProducts = (query: string) => {
    setFilters({ search: query })
  }

  const getProductBySlug = (slug: string): Product | null => {
    return products.find(product => product.slug === slug) || null
  }

  const refetchProducts = () => {
    fetchProducts()
  }

  const value: ProductContextType = {
    products,
    categories,
    filters,
    loading,
    error,
    totalProducts,
    setFilters,
    resetFilters,
    searchProducts,
    getProductBySlug,
    refetchProducts
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}