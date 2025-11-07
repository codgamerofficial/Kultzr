import React from 'react'
import { useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { getProductBySlug } = useProducts()
  const { addItem } = useCart()

  const product = getProductBySlug(id || '')
  
  if (!product) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-street-text mb-4">Product Not Found</h1>
          <p className="text-street-text-muted">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product, undefined, 1)
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container-street">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square rounded overflow-hidden">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-street-text mb-2">{product.name}</h1>
              <p className="text-street-text-muted">{product.brand}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < 4 ? 'text-street-accent fill-current' : 'text-street-text-muted'}
                    />
                  ))}
                </div>
                <span className="text-sm text-street-text-muted">(4.2) • 234 reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-street-text">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xl text-street-text-muted line-through">
                  ₹{product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-street-text-muted">{product.description}</p>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-street-text mb-3">Size</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="p-3 border border-street-border rounded-lg text-street-text hover:border-street-accent hover:text-street-accent transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                ADD TO CART
              </button>
              <button className="p-3 border border-street-border rounded-lg text-street-text hover:border-street-accent hover:text-street-accent transition-colors">
                <Heart size={20} />
              </button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-street-border">
              <div className="text-center">
                <Truck className="text-street-accent mx-auto mb-2" size={24} />
                <p className="text-sm text-street-text-muted">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="text-street-accent mx-auto mb-2" size={24} />
                <p className="text-sm text-street-text-muted">Authentic</p>
              </div>
              <div className="text-center">
                <RefreshCw className="text-street-accent mx-auto mb-2" size={24} />
                <p className="text-sm text-street-text-muted">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage