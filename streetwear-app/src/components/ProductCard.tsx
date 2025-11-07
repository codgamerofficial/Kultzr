import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Product } from '../types'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  className?: string
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem } = useCart()
  const { user } = useAuth()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, undefined, 1)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error('Please sign in to add items to wishlist')
      return
    }
    toast.success('Added to wishlist!', {
      icon: '💜',
    })
  }

  const getDiscountPercentage = () => {
    if (product.compareAtPrice && product.compareAtPrice > product.price) {
      return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    }
    return 0
  }

  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <Link to={`/product/${product.slug}`}>
      <motion.div
        className={`product-card group ${className}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
          <img
            src={product.images[currentImageIndex] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOnSale && (
              <span className="badge-sale text-xs font-bold px-2 py-1 rounded">
                {getDiscountPercentage()}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="badge-new text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            )}
            {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                LIMITED
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70"
          >
            <Heart size={16} className="text-white hover:text-street-accent transition-colors" />
          </button>

          {/* Quick Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20
            }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3"
          >
            <button
              onClick={handleAddToCart}
              className="w-full bg-street-accent text-street-primary font-semibold py-2 px-4 rounded-lg hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Quick Add
            </button>
          </motion.div>

          {/* Out of Stock Overlay */}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-semibold text-lg">SOLD OUT</span>
            </div>
          )}

          {/* Image Dots (if multiple images) */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    currentImageIndex === index ? 'bg-street-accent' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-street-text group-hover:text-street-accent transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>

          <p className="text-sm text-street-text-muted">{product.brand}</p>

          {/* Rating (placeholder) */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < 4 ? 'text-street-accent fill-current' : 'text-street-text-muted'}
                />
              ))}
            </div>
            <span className="text-xs text-street-text-muted">(4.2)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-street-text">
              ₹{product.price.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="text-sm text-street-text-muted line-through">
                ₹{product.compareAtPrice?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-street-text-muted">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-street-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-street-text-muted">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-street-text-muted">Sizes:</span>
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map((size) => (
                  <span
                    key={size}
                    className="text-xs bg-street-secondary text-street-text px-2 py-1 rounded"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs text-street-text-muted">
                    +{product.sizes.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductCard