export interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  brand: string
  sizes: string[]
  colors: string[]
  material: string
  careInstructions?: string
  sku: string
  slug: string
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  printfulSyncId?: string
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  productId: string
  size: string
  color: string
  colorHex: string
  stockQuantity: number
  price: number
  sku: string
  printfulVariantId?: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  phone?: string
  addresses: Address[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  type: 'shipping' | 'billing'
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  product: Product
  variant?: ProductVariant
  addedAt: string
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  subtotal: number
  taxAmount: number
  shippingAmount: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  printfulOrderId?: string
  trackingNumber?: string
  notes?: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  productName: string
  productSku: string
  variantDetails?: {
    size?: string
    color?: string
  }
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export interface FilterOptions {
  category?: string
  priceRange: [number, number]
  sizes: string[]
  colors: string[]
  brands: string[]
  inStock?: boolean
  sortBy: 'newest' | 'price-low' | 'price-high' | 'name' | 'popular'
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  subtotal: number
  taxAmount: number
  shippingAmount: number
  total: number
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'canceled'
  clientSecret: string
}

export interface PrintfulProduct {
  id: number
  externalId: string
  name: string
  variants: PrintfulVariant[]
  thumbnail: string
  isIgnored: boolean
  sku: string
}

export interface PrintfulVariant {
  id: number
  externalId: string
  variantId: number
  files: any[]
  options: any[]
  retailPrice: string
  name: string
  size: string
  color: string
  price: string
  inStock: boolean
  availabilityStatus: string
}

export interface PrintfulOrder {
  id: number
  externalId: string
  status: string
  shipping: string
  recipient: any
  items: any[]
  created: number
  updated: number
}

export interface NotificationSettings {
  orderUpdates: boolean
  newProducts: boolean
  promotions: boolean
  restock: boolean
}

export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  recentOrders: Order[]
  topProducts: Product[]
  monthlyStats: {
    month: string
    orders: number
    revenue: number
  }[]
}

export type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'name' | 'popular'

export type UserRole = 'customer' | 'admin' | 'moderator'

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface ProductFilters {
  search?: string
  category?: string
  brand?: string
  size?: string
  color?: string
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  sortBy?: SortOption
  page?: number
  limit?: number
}