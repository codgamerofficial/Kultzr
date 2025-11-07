import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, User, Heart, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductContext'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()
  const { searchProducts } = useProducts()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchProducts(searchQuery)
      navigate('/products')
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-street-primary/95 backdrop-blur-md border-b border-street-border">
      <div className="container-street">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-street-text hover:text-street-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-display font-bold text-street-accent tracking-wider"
            >
              STREET CULTURE
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              HOME
            </Link>
            <Link to="/products" className="nav-link">
              SHOP
            </Link>
            <Link to="/products?category=hoodies" className="nav-link">
              HOODIES
            </Link>
            <Link to="/products?category=t-shirts" className="nav-link">
              T-SHIRTS
            </Link>
            <Link to="/products?category=jackets" className="nav-link">
              JACKETS
            </Link>
            <Link to="/products?featured=true" className="nav-link">
              NEW DROPS
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-xs">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-street-secondary border border-street-border rounded-lg text-street-text placeholder-street-text-muted focus:ring-2 focus:ring-street-accent focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-street-text-muted" size={18} />
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon (Mobile) */}
            <button className="md:hidden p-2 text-street-text hover:text-street-accent transition-colors">
              <Search size={22} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden sm:block p-2 text-street-text hover:text-street-accent transition-colors relative"
            >
              <Heart size={22} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-street-text hover:text-street-accent transition-colors relative"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-street-accent text-street-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="p-2 text-street-text hover:text-street-accent transition-colors">
                  <User size={22} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-street-secondary border border-street-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-street-text hover:text-street-accent hover:bg-street-border transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-street-text hover:text-street-accent hover:bg-street-border transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-street-text hover:text-street-accent hover:bg-street-border transition-colors"
                  >
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-street-text hover:text-street-accent hover:bg-street-border transition-colors border-t border-street-border"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="p-2 text-street-text hover:text-street-accent transition-colors"
              >
                <User size={22} />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-street-border"
            >
              <nav className="py-4 space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-2 text-street-text hover:text-street-accent hover:bg-street-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOME
                </Link>
                <Link
                  to="/products"
                  className="block px-4 py-2 text-street-text hover:text-street-accent hover:bg-street-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SHOP ALL
                </Link>
                <Link
                  to="/products?category=hoodies"
                  className="block px-4 py-2 text-street-text hover:text-street-accent hover:bg-street-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOODIES
                </Link>
                <Link
                  to="/products?category=t-shirts"
                  className="block px-4 py-2 text-street-text hover:text-street-accent hover:bg-street-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  T-SHIRTS
                </Link>
                <Link
                  to="/products?category=jackets"
                  className="block px-4 py-2 text-street-text hover:text-street-accent hover:bg-street-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  JACKETS
                </Link>
                <Link
                  to="/products?featured=true"
                  className="block px-4 py-2 text-street-text hover:text-street-accent hover:bg-street-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  NEW DROPS
                </Link>
                
                {!user && (
                  <Link
                    to="/auth"
                    className="block px-4 py-2 text-street-accent font-semibold border-t border-street-border mt-2 pt-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    SIGN IN
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header