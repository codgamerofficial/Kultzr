import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'

const HomePage: React.FC = () => {
  const { products, loading } = useProducts()
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1695827163486-b86eac571321?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBzdHlsZSUyMG1vZGVsfGVufDF8fHx8MTc2MjQ5NzIzNnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Street Culture Hero"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-street-primary/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title text-white text-shadow mb-6">
              STREET
              <br />
              <span className="text-gradient-accent">CULTURE</span>
            </h1>
            <p className="text-xl md:text-2xl text-street-text-muted mb-8 max-w-2xl mx-auto">
              Redefining urban fashion. Limited drops. Authentic culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-primary inline-flex items-center justify-center">
                EXPLORE COLLECTION
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/products?featured=true" className="btn-secondary inline-flex items-center justify-center">
                NEW DROPS
                <Star className="ml-2" size={20} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-street-accent rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-street-accent rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Drop Countdown Banner */}
      <section className="bg-gradient-to-r from-street-accent-orange to-red-500 py-4">
        <div className="container-street">
          <div className="flex items-center justify-center text-center">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-street-primary font-semibold"
            >
              🔥 <strong>NEW DROP:</strong> NIGHT BOMBER Jacket - 
              <span className="ml-2">Releasing Nov 15, 2024</span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-street-secondary">
        <div className="container-street">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-street-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-street-accent" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-street-text mb-2">Free Shipping</h3>
              <p className="text-street-text-muted">Free shipping on orders over ₹2,999</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-street-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-street-accent" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-street-text mb-2">Authentic Quality</h3>
              <p className="text-street-text-muted">Premium materials and craftsmanship</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-street-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="text-street-accent" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-street-text mb-2">Easy Returns</h3>
              <p className="text-street-text-muted">30-day hassle-free returns</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container-street">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">TRENDING NOW</h2>
            <p className="text-street-text-muted max-w-2xl mx-auto">
              Discover our most popular pieces that are defining street culture today
            </p>
          </motion.div>

          {loading ? (
            <div className="street-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton aspect-product" />
              ))}
            </div>
          ) : (
            <div className="street-grid">
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary">
              VIEW ALL PRODUCTS
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-primary">
        <div className="container-street">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-street-text mb-4">
              STAY IN THE LOOP
            </h2>
            <p className="text-street-text-muted mb-8">
              Get notified about new drops, exclusive offers, and street culture updates
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 input"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                SUBSCRIBE
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage