import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuIcon, CloseIcon, SearchIcon, CartIcon, ProfileIcon, HeartIcon } from './icons';
import { Badge } from './ui/badge';

interface HeaderProps {
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  onWishlistClick?: () => void;
  onLogoClick?: () => void;
  cartItemCount?: number;
  wishlistCount?: number;
  isMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onSearchClick,
  onCartClick,
  onProfileClick,
  onWishlistClick,
  onLogoClick,
  cartItemCount = 0,
  wishlistCount = 0,
  isMenuOpen = false,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[var(--kultzr-primary)] border-b border-[var(--border)] backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onMenuClick}
            className="lg:hidden p-2 text-[var(--kultzr-text-primary)]"
          >
            {isMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </motion.button>

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={onLogoClick}
            className="cursor-pointer"
          >
            <h1 className="text-[var(--kultzr-accent-neon)] tracking-tighter text-display">
              [KULTZR]
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors">
              NEW DROPS
            </a>
            <a href="#" className="text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors">
              CLOTHING
            </a>
            <a href="#" className="text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors">
              ACCESSORIES
            </a>
            <a href="#" className="text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors">
              SALE
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onSearchClick}
              className="p-2 text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors"
            >
              <SearchIcon size={22} />
            </motion.button>

            {/* Wishlist */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onWishlistClick}
              className="hidden sm:flex p-2 text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors relative"
            >
              <HeartIcon size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--kultzr-danger)] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </motion.button>

            {/* Cart */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onCartClick}
              className="p-2 text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors relative"
            >
              <CartIcon size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </motion.button>

            {/* Profile */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onProfileClick}
              className="hidden sm:flex p-2 text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors"
            >
              <ProfileIcon size={22} />
            </motion.button>
          </div>
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
            className="lg:hidden border-t border-[var(--border)] overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-3">
              <a href="#" className="block py-2 text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors">
                NEW DROPS
              </a>
              <a href="#" className="block py-2 text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors">
                CLOTHING
              </a>
              <a href="#" className="block py-2 text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors">
                ACCESSORIES
              </a>
              <a href="#" className="block py-2 text-[var(--kultzr-text-primary)] hover:text-[var(--kultzr-accent-neon)] transition-colors">
                SALE
              </a>
              <div className="pt-2 border-t border-[var(--border)]">
                <a href="#" className="flex items-center gap-2 py-2 text-[var(--kultzr-text-primary)]">
                  <ProfileIcon size={18} />
                  Profile
                </a>
                <a href="#" className="flex items-center gap-2 py-2 text-[var(--kultzr-text-primary)]">
                  <HeartIcon size={18} />
                  Wishlist
                  {wishlistCount > 0 && (
                    <Badge className="bg-[var(--kultzr-danger)] border-0 text-white ml-auto">
                      {wishlistCount}
                    </Badge>
                  )}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
