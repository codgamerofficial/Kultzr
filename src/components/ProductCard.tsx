import React from 'react';
import { HeartIcon, PlusIcon } from './icons';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: 'NEW' | 'LIMITED' | 'DROP';
  rating?: number;
  category?: string;
  sizes?: string[];
  colors?: string[];
  description?: string;
}

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  onProductClick?: (product: Product) => void;
  isInWishlist?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'grid',
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  isInWishlist = false,
}) => {
  if (variant === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] overflow-hidden shadow-kultzr-1 hover:shadow-kultzr-2 transition-shadow cursor-pointer flex gap-4"
        onClick={() => onProductClick?.(product)}
      >
        <div className="w-32 h-32 flex-shrink-0 relative bg-[var(--kultzr-primary)]">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <div className="absolute top-2 left-2">
              <Badge
                className={`
                  ${product.badge === 'NEW' ? 'bg-[var(--kultzr-accent-neon)]' : ''}
                  ${product.badge === 'LIMITED' ? 'bg-[var(--kultzr-accent-orange)]' : ''}
                  ${product.badge === 'DROP' ? 'bg-[var(--kultzr-danger)]' : ''}
                  text-[var(--kultzr-primary)] border-0
                `}
              >
                {product.badge}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex-1 py-3 pr-4 flex justify-between items-center">
          <div>
            <h3 className="text-[var(--kultzr-text-primary)] mb-1">{product.name}</h3>
            <p className="text-[var(--kultzr-text-muted)] text-[var(--text-sm)] mb-2">
              {product.category}
            </p>
            {product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <span className="text-[var(--kultzr-accent-neon)]">★</span>
                <span className="text-[var(--text-sm)] text-[var(--kultzr-text-muted)]">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}
            <p className="text-[var(--kultzr-text-primary)]">₹{product.price.toLocaleString()}</p>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist?.(product.id);
              }}
              className="p-2 rounded-full hover:bg-[var(--kultzr-primary)] transition-colors"
            >
              <HeartIcon
                size={20}
                filled={isInWishlist}
                className={isInWishlist ? 'text-[var(--kultzr-danger)]' : 'text-[var(--kultzr-text-muted)]'}
              />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product);
              }}
              className="px-4 py-2 bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] rounded-[var(--radius-md)] hover:brightness-110 transition-all flex items-center gap-2"
            >
              <PlusIcon size={16} strokeWidth={2.5} />
              Add
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] overflow-hidden shadow-kultzr-1 hover:shadow-kultzr-2 transition-all cursor-pointer group"
      onClick={() => onProductClick?.(product)}
    >
      <div className="relative aspect-[3/4] bg-[var(--kultzr-primary)] overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge
              className={`
                ${product.badge === 'NEW' ? 'bg-[var(--kultzr-accent-neon)]' : ''}
                ${product.badge === 'LIMITED' ? 'bg-[var(--kultzr-accent-orange)]' : ''}
                ${product.badge === 'DROP' ? 'bg-[var(--kultzr-danger)]' : ''}
                text-[var(--kultzr-primary)] border-0
              `}
            >
              {product.badge}
            </Badge>
          </div>
        )}
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product.id);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[var(--kultzr-black-70)] backdrop-blur-sm hover:bg-[var(--kultzr-black-90)] transition-colors"
        >
          <HeartIcon
            size={18}
            filled={isInWishlist}
            className={isInWishlist ? 'text-[var(--kultzr-danger)]' : 'text-white'}
          />
        </motion.button>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="w-full py-2.5 bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] rounded-[var(--radius-md)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <PlusIcon size={18} strokeWidth={2.5} />
            Quick Add
          </motion.button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-[var(--kultzr-text-primary)] flex-1">{product.name}</h3>
        </div>
        
        {product.category && (
          <p className="text-[var(--kultzr-text-muted)] text-[var(--text-sm)] mb-2">
            {product.category}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <p className="text-[var(--kultzr-text-primary)]">
            ₹{product.price.toLocaleString()}
          </p>
          {product.rating && (
            <div className="flex items-center gap-1">
              <span className="text-[var(--kultzr-accent-neon)]">★</span>
              <span className="text-[var(--text-sm)] text-[var(--kultzr-text-muted)]">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
