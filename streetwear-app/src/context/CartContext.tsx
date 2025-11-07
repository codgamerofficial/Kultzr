import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CartItem, Cart, Product, ProductVariant } from '../types'
import toast from 'react-hot-toast'

interface CartContextType extends Cart {
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string, variantId?: string) => boolean
  getItemQuantity: (productId: string, variantId?: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variant?: ProductVariant; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload
      const existingItemIndex = state.items.findIndex(
        item => item.productId === product.id && item.variantId === variant?.id
      )

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
          productId: product.id,
          variantId: variant?.id,
          quantity,
          product,
          variant,
          addedAt: new Date().toISOString()
        }
        newItems = [...state.items, newItem]
      }

      const newCart = calculateCartTotals(newItems)
      localStorage.setItem('cart', JSON.stringify(newItems))
      return newCart
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const newCart = calculateCartTotals(newItems)
      localStorage.setItem('cart', JSON.stringify(newItems))
      return newCart
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id })
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      const newCart = calculateCartTotals(newItems)
      localStorage.setItem('cart', JSON.stringify(newItems))
      return newCart
    }

    case 'CLEAR_CART': {
      localStorage.removeItem('cart')
      return {
        items: [],
        totalItems: 0,
        subtotal: 0,
        taxAmount: 0,
        shippingAmount: 0,
        total: 0
      }
    }

    case 'LOAD_CART': {
      return calculateCartTotals(action.payload)
    }

    default:
      return state
  }
}

const calculateCartTotals = (items: CartItem[]): Cart => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.price || item.product.price
    return sum + (price * item.quantity)
  }, 0)

  const taxAmount = subtotal * 0.18 // 18% GST
  const shippingAmount = subtotal > 2999 ? 0 : 99
  const total = subtotal + taxAmount + shippingAmount

  return {
    items,
    totalItems,
    subtotal,
    taxAmount,
    shippingAmount,
    total
  }
}

const initialState: Cart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  taxAmount: 0,
  shippingAmount: 0,
  total: 0
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: items })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  const addItem = (product: Product, variant?: ProductVariant, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } })
    toast.success(`Added ${product.name} to cart!`, {
      icon: '🛒',
      style: {
        background: '#1E1E20',
        color: '#F5F5F5',
        border: '1px solid #A4FF00',
      },
    })
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
    toast.success('Item removed from cart')
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Cart cleared')
  }

  const isInCart = (productId: string, variantId?: string): boolean => {
    return state.items.some(
      item => item.productId === productId && item.variantId === variantId
    )
  }

  const getItemQuantity = (productId: string, variantId?: string): number => {
    const item = state.items.find(
      item => item.productId === productId && item.variantId === variantId
    )
    return item?.quantity || 0
  }

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}