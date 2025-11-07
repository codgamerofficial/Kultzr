import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'

const CartPage: React.FC = () => {
  const { items, total, updateQuantity, removeItem, subtotal, taxAmount, shippingAmount } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="container-street">
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-street-text-muted mb-4" />
            <h1 className="text-2xl font-bold text-street-text mb-2">Your cart is empty</h1>
            <p className="text-street-text-muted mb-8">Add some items to get started</p>
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container-street">
        <h1 className="section-title">SHOPPING CART</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-street-text">{item.product.name}</h3>
                    <p className="text-sm text-street-text-muted">{item.product.brand}</p>
                    <p className="text-lg font-bold text-street-text mt-1">
                      ₹{item.product.price.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-street-text-muted hover:text-street-accent"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-street-text-muted hover:text-street-accent"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-street-text-muted hover:text-red-500 ml-4"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-street-text mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-street-text-muted">Subtotal</span>
                <span className="text-street-text">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-street-text-muted">Shipping</span>
                <span className="text-street-accent">
                  {shippingAmount === 0 ? 'FREE' : `₹${shippingAmount}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-street-text-muted">Tax</span>
                <span className="text-street-text">₹{taxAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-street-border pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-street-text">Total</span>
                  <span className="text-street-text">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full mt-6 text-center">
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage