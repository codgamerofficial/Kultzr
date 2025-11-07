import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { ProductCard, Product } from './components/ProductCard';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Separator } from './components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  SearchIcon, 
  FilterIcon, 
  CloseIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  CheckIcon,
  PackageIcon,
  TruckIcon,
  ShareIcon,
  BackIcon
} from './components/icons';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

// Mock product data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'STEALTH HOODIE',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1629097499121-290fd9a95dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMG1pbmltYWx8ZW58MXx8fHwxNzYyNTIyMzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'NEW',
    rating: 4.8,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#000000', '#1E1E20', '#6B6B6B'],
    description: 'Premium heavyweight cotton hoodie with embroidered branding. Built for the streets, refined for the culture.'
  },
  {
    id: '2',
    name: 'GHOST RIDER TEE',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMHByb2R1Y3R8ZW58MXx8fHwxNzYyNTIyMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'LIMITED',
    rating: 4.6,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#FFFFFF', '#A4FF00'],
    description: 'Limited edition graphic tee. 100% organic cotton. Only 100 pieces made.'
  },
  {
    id: '3',
    name: 'CLOUD WALKER',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1573875133340-0b589f59a8c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwbWluaW1hbHxlbnwxfHx8fDE3NjI0ODgyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    category: 'Footwear',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['#FFFFFF', '#F5F5F5'],
    description: 'Ultra-lightweight sneakers with premium leather upper. Engineered for all-day comfort.'
  },
  {
    id: '4',
    name: 'URBAN DENIM',
    price: 5499,
    image: 'https://images.unsplash.com/photo-1602585198422-d795fa9bfd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI0NDA5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    category: 'Bottoms',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['#4A5568', '#2D3748'],
    description: 'Slim-fit denim with stretch. Washed for a vintage look. Japanese fabric.'
  },
  {
    id: '5',
    name: 'NIGHT BOMBER',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1760126070359-5b82710274fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib21iZXIlMjBqYWNrZXQlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc2MjQ5MTIxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'DROP',
    rating: 4.8,
    category: 'Jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#1E1E20'],
    description: 'MA-1 inspired bomber jacket. Water-resistant nylon shell. Drops Nov 15.'
  },
  {
    id: '6',
    name: 'FUTURE CAP',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1609109828990-5487fd36a798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXAlMjBoYXQlMjB1cmJhbnxlbnwxfHx8fDE3NjI1MjIzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.5,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['#000000', '#A4FF00'],
    description: '6-panel structured cap. Embroidered logo. Adjustable snapback.'
  },
  {
    id: '7',
    name: 'VOID BACKPACK',
    price: 6499,
    image: 'https://images.unsplash.com/photo-1747930506213-748c5b8f8e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMHN0cmVldCUyMHN0eWxlfGVufDF8fHx8MTc2MjUyMjM5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'NEW',
    rating: 4.9,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['#000000'],
    description: '30L capacity. Laptop sleeve. Water-resistant coating. Hidden pockets.'
  },
  {
    id: '8',
    name: 'REBEL HOODIE',
    price: 5499,
    image: 'https://images.unsplash.com/photo-1635650805015-2fa50682873a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldHdlYXIlMjBmYXNoaW9ufGVufDF8fHx8MTc2MjUyMjI5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#6B6B6B', '#A4FF00'],
    description: 'Oversized fit hoodie. French terry cotton. Screen-printed graphics.'
  }
];

type View = 'home' | 'product-detail' | 'cart' | 'checkout' | 'profile' | 'search' | 'admin-upload' | 'order-confirmation';

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [orderNumber, setOrderNumber] = useState('');
  
  // Checkout state
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'shipping' | 'payment'>('address');
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const categories = ['all', 'Hoodies', 'T-Shirts', 'Footwear', 'Bottoms', 'Jackets', 'Accessories'];

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product, size?: string) => {
    const existingItem = cart.find(item => item.id === product.id && item.selectedSize === size);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedSize: size }]);
    }
    
    toast.success('Added to cart!', {
      description: `${product.name} ${size ? `(${size})` : ''}`
    });
  };

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast('Removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      toast.success('Added to wishlist!');
    }
  };

  const updateCartQuantity = (productId: string, size: string | undefined, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId && item.selectedSize === size) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string, size: string | undefined) => {
    setCart(cart.filter(item => !(item.id === productId && item.selectedSize === size)));
    toast('Removed from cart');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const orderNum = `KLTZ${Date.now().toString().slice(-8)}`;
    setOrderNumber(orderNum);
    setCurrentView('order-confirmation');
    setCart([]);
    toast.success('Order placed successfully!');
  };

  // Home View
  const HomeView = () => (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--kultzr-primary)]">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1695827163486-b86eac571321?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBzdHlsZSUyMG1vZGVsfGVufDF8fHx8MTc2MjQ5NzIzNnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Hero"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[56px] sm:text-[72px] lg:text-[96px] mb-4 text-display leading-none">
              STREET<br/>
              <span className="text-[var(--kultzr-accent-neon)]">CULTURE</span>
            </h1>
            <p className="text-[var(--kultzr-text-muted)] mb-8 max-w-md mx-auto">
              Redefining urban fashion. Limited drops. Authentic culture.
            </p>
            <Button 
              className="bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] hover:brightness-110 px-8 py-6 rounded-[var(--radius-md)]"
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            >
              EXPLORE COLLECTION
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Drop Countdown Banner */}
      <section className="bg-[var(--kultzr-accent-orange)] py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[var(--kultzr-primary)]">
            <span className="mr-4">🔥 NEW DROP:</span>
            <strong>NIGHT BOMBER</strong> 
            <span className="ml-4">— Releasing Nov 15, 2024</span>
          </p>
        </div>
      </section>

      {/* Category Chips */}
      <section className="py-8 bg-[var(--kultzr-surface)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={`
                  whitespace-nowrap rounded-[var(--radius-pill)] px-6
                  ${selectedCategory === cat 
                    ? 'bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)]' 
                    : 'border-[var(--border)] text-[var(--kultzr-text-primary)] hover:border-[var(--kultzr-accent-neon)]'
                  }
                `}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-[var(--kultzr-text-primary)] mb-2">FEATURED PRODUCTS</h2>
              <p className="text-[var(--kultzr-text-muted)]">{filteredProducts.length} items</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className={viewMode === 'grid' ? 'border-[var(--kultzr-accent-neon)]' : ''}
                onClick={() => setViewMode('grid')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={viewMode === 'list' ? 'border-[var(--kultzr-accent-neon)]' : ''}
                onClick={() => setViewMode('list')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </Button>
            </div>
          </div>

          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                variant={viewMode}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                onProductClick={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-detail');
                }}
                isInWishlist={wishlist.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  // Product Detail View
  const ProductDetailView = () => {
    if (!selectedProduct) return null;
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState(selectedProduct.colors?.[0] || '');

    return (
      <div className="min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => setCurrentView('home')}
          >
            <BackIcon size={20} className="mr-2" />
            Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-[3/4] bg-[var(--kultzr-surface)] rounded-[var(--radius-lg)] overflow-hidden mb-4">
                <ImageWithFallback
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] overflow-hidden cursor-pointer ${
                      currentImageIndex === i ? 'ring-2 ring-[var(--kultzr-accent-neon)]' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(i)}
                  >
                    <ImageWithFallback
                      src={selectedProduct.image}
                      alt={`${selectedProduct.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  {selectedProduct.badge && (
                    <Badge className={`
                      mb-2
                      ${selectedProduct.badge === 'NEW' ? 'bg-[var(--kultzr-accent-neon)]' : ''}
                      ${selectedProduct.badge === 'LIMITED' ? 'bg-[var(--kultzr-accent-orange)]' : ''}
                      ${selectedProduct.badge === 'DROP' ? 'bg-[var(--kultzr-danger)]' : ''}
                      text-[var(--kultzr-primary)] border-0
                    `}>
                      {selectedProduct.badge}
                    </Badge>
                  )}
                  <h1 className="text-[var(--kultzr-text-primary)] mb-2">{selectedProduct.name}</h1>
                  <p className="text-[var(--kultzr-text-muted)]">{selectedProduct.category}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWishlist(selectedProduct.id)}
                >
                  <HeartIcon 
                    size={24}
                    filled={wishlist.includes(selectedProduct.id)}
                    className={wishlist.includes(selectedProduct.id) ? 'text-[var(--kultzr-danger)]' : ''}
                  />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {selectedProduct.rating && (
                  <>
                    <span className="text-[var(--kultzr-accent-neon)]">★</span>
                    <span className="text-[var(--kultzr-text-primary)]">{selectedProduct.rating}</span>
                    <span className="text-[var(--kultzr-text-muted)]">(234 reviews)</span>
                  </>
                )}
              </div>

              <h2 className="text-[var(--text-h3)] text-[var(--kultzr-text-primary)] mb-8">
                ₹{selectedProduct.price.toLocaleString()}
              </h2>

              <p className="text-[var(--kultzr-text-muted)] mb-8">
                {selectedProduct.description}
              </p>

              {/* Size Selector */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[var(--kultzr-text-primary)]">Select Size</label>
                    <button className="text-[var(--kultzr-accent-neon)] text-[var(--text-sm)]">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map(size => (
                      <Button
                        key={size}
                        variant="outline"
                        className={`
                          w-14 h-14
                          ${selectedSize === size 
                            ? 'bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] border-[var(--kultzr-accent-neon)]' 
                            : 'border-[var(--border)] text-[var(--kultzr-text-primary)]'
                          }
                        `}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div className="mb-8">
                  <label className="block text-[var(--kultzr-text-primary)] mb-3">Color</label>
                  <div className="flex gap-2">
                    {selectedProduct.colors.map(color => (
                      <button
                        key={color}
                        className={`
                          w-10 h-10 rounded-full border-2 transition-all
                          ${selectedColor === color 
                            ? 'border-[var(--kultzr-accent-neon)] scale-110' 
                            : 'border-[var(--border)]'
                          }
                        `}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] hover:brightness-110 py-6 rounded-[var(--radius-md)]"
                  onClick={() => {
                    if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) {
                      toast.error('Please select a size');
                      return;
                    }
                    addToCart(selectedProduct, selectedSize);
                  }}
                >
                  ADD TO CART
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[var(--border)] text-[var(--kultzr-text-primary)] py-6 rounded-[var(--radius-md)]"
                >
                  BUY NOW
                </Button>
              </div>

              <Separator className="my-8" />

              {/* Product Details */}
              <div className="space-y-4 text-[var(--text-sm)]">
                <div className="flex items-center gap-3 text-[var(--kultzr-text-muted)]">
                  <TruckIcon size={20} />
                  <span>Free shipping on orders over ₹2,999</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--kultzr-text-muted)]">
                  <PackageIcon size={20} />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--kultzr-text-muted)]">
                  <CheckIcon size={20} />
                  <span>Easy 30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Cart View
  const CartView = () => (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[var(--kultzr-text-primary)]">Shopping Cart</h1>
          <Button variant="ghost" onClick={() => setCurrentView('home')}>
            Continue Shopping
          </Button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <CartIcon size={64} className="mx-auto mb-4 text-[var(--kultzr-text-muted)]" />
            <h2 className="text-[var(--kultzr-text-primary)] mb-2">Your cart is empty</h2>
            <p className="text-[var(--kultzr-text-muted)] mb-6">Add some items to get started</p>
            <Button
              className="bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)]"
              onClick={() => setCurrentView('home')}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.selectedSize}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] p-4 flex gap-4"
                >
                  <div className="w-24 h-24 bg-[var(--kultzr-primary)] rounded-[var(--radius-sm)] overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="text-[var(--kultzr-text-primary)]">{item.name}</h3>
                        {item.selectedSize && (
                          <p className="text-[var(--kultzr-text-muted)] text-[var(--text-sm)]">
                            Size: {item.selectedSize}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-[var(--kultzr-text-muted)] hover:text-[var(--kultzr-danger)]"
                      >
                        <TrashIcon size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-[var(--kultzr-primary)] rounded-[var(--radius-md)] p-1">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.selectedSize, -1)}
                          className="p-1 hover:text-[var(--kultzr-accent-neon)]"
                        >
                          <MinusIcon size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.selectedSize, 1)}
                          className="p-1 hover:text-[var(--kultzr-accent-neon)]"
                        >
                          <PlusIcon size={16} />
                        </button>
                      </div>
                      <p className="text-[var(--kultzr-text-primary)]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] p-6 sticky top-20">
                <h2 className="text-[var(--kultzr-text-primary)] mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[var(--kultzr-text-muted)]">
                    <span>Subtotal ({cartItemCount} items)</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[var(--kultzr-text-muted)]">
                    <span>Shipping</span>
                    <span className="text-[var(--kultzr-accent-neon)]">
                      {cartTotal > 2999 ? 'FREE' : '₹99'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-[var(--kultzr-text-primary)]">
                    <span>Total</span>
                    <span>₹{(cartTotal + (cartTotal > 2999 ? 0 : 99)).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] hover:brightness-110 py-6 rounded-[var(--radius-md)]"
                  onClick={() => {
                    setCurrentView('checkout');
                    setCheckoutStep('address');
                  }}
                >
                  PROCEED TO CHECKOUT
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Checkout View
  const CheckoutView = () => (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-[var(--kultzr-text-primary)] mb-8">Checkout</h1>

        <div className="flex items-center gap-4 mb-8">
          {['address', 'shipping', 'payment'].map((step, index) => (
            <React.Fragment key={step}>
              <div className={`
                flex items-center gap-2 px-4 py-2 rounded-[var(--radius-pill)]
                ${checkoutStep === step 
                  ? 'bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)]' 
                  : 'bg-[var(--kultzr-surface)] text-[var(--kultzr-text-muted)]'
                }
              `}>
                <span className="w-6 h-6 rounded-full bg-current opacity-20 flex items-center justify-center">
                  <span className="text-[var(--text-xs)]">{index + 1}</span>
                </span>
                <span className="capitalize">{step}</span>
              </div>
              {index < 2 && <ChevronRightIcon size={16} className="text-[var(--kultzr-text-muted)]" />}
            </React.Fragment>
          ))}
        </div>

        {checkoutStep === 'address' && (
          <div className="bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] p-6">
            <h2 className="text-[var(--kultzr-text-primary)] mb-6">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[var(--kultzr-text-primary)] mb-2">Full Name</label>
                <Input
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  className="bg-[var(--kultzr-primary)] border-[var(--border)]"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-[var(--kultzr-text-primary)] mb-2">Phone Number</label>
                <Input
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="bg-[var(--kultzr-primary)] border-[var(--border)]"
                  placeholder="+91 "
                />
              </div>
              <div>
                <label className="block text-[var(--kultzr-text-primary)] mb-2">Address</label>
                <Textarea
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  className="bg-[var(--kultzr-primary)] border-[var(--border)]"
                  placeholder="Street address, apartment, suite, etc."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--kultzr-text-primary)] mb-2">City</label>
                  <Input
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="bg-[var(--kultzr-primary)] border-[var(--border)]"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-[var(--kultzr-text-primary)] mb-2">Pincode</label>
                  <Input
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    className="bg-[var(--kultzr-primary)] border-[var(--border)]"
                    placeholder="123456"
                  />
                </div>
              </div>
              <Button
                className="w-full bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] mt-6"
                onClick={() => setCheckoutStep('shipping')}
              >
                Continue to Shipping
              </Button>
            </div>
          </div>
        )}

        {checkoutStep === 'shipping' && (
          <div className="bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] p-6">
            <h2 className="text-[var(--kultzr-text-primary)] mb-6">Shipping Method</h2>
            <div className="space-y-3">
              {[
                { name: 'Standard Delivery', time: '5-7 business days', price: 0 },
                { name: 'Express Delivery', time: '2-3 business days', price: 199 },
                { name: 'Same Day Delivery', time: 'Within 24 hours', price: 499 }
              ].map((method) => (
                <label
                  key={method.name}
                  className="flex items-center justify-between p-4 border border-[var(--border)] rounded-[var(--radius-md)] cursor-pointer hover:border-[var(--kultzr-accent-neon)]"
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" defaultChecked={method.price === 0} />
                    <div>
                      <p className="text-[var(--kultzr-text-primary)]">{method.name}</p>
                      <p className="text-[var(--kultzr-text-muted)] text-[var(--text-sm)]">{method.time}</p>
                    </div>
                  </div>
                  <p className="text-[var(--kultzr-text-primary)]">
                    {method.price === 0 ? 'FREE' : `₹${method.price}`}
                  </p>
                </label>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setCheckoutStep('address')}>
                Back
              </Button>
              <Button 
                className="flex-1 bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)]"
                onClick={() => setCheckoutStep('payment')}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {checkoutStep === 'payment' && (
          <div className="bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] p-6">
            <h2 className="text-[var(--kultzr-text-primary)] mb-6">Payment Method</h2>
            <div className="space-y-3 mb-6">
              {[
                { name: 'UPI', icon: '📱' },
                { name: 'Credit/Debit Card', icon: '💳' },
                { name: 'Net Banking', icon: '🏦' },
                { name: 'Cash on Delivery', icon: '💵' }
              ].map((method) => (
                <label
                  key={method.name}
                  className="flex items-center gap-3 p-4 border border-[var(--border)] rounded-[var(--radius-md)] cursor-pointer hover:border-[var(--kultzr-accent-neon)]"
                >
                  <input type="radio" name="payment" defaultChecked={method.name === 'UPI'} />
                  <span className="text-[24px]">{method.icon}</span>
                  <span className="text-[var(--kultzr-text-primary)]">{method.name}</span>
                </label>
              ))}
            </div>

            <div className="bg-[var(--kultzr-primary)] rounded-[var(--radius-md)] p-4 mb-6">
              <h3 className="text-[var(--kultzr-text-primary)] mb-3">Order Summary</h3>
              <div className="space-y-2 text-[var(--text-sm)]">
                <div className="flex justify-between text-[var(--kultzr-text-muted)]">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[var(--kultzr-text-muted)]">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-[var(--kultzr-text-primary)]">
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCheckoutStep('shipping')}>
                Back
              </Button>
              <Button 
                className="flex-1 bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)]"
                onClick={handleCheckout}
              >
                Place Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Order Confirmation View
  const OrderConfirmationView = () => (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-[var(--kultzr-accent-neon)] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon size={40} className="text-[var(--kultzr-primary)]" strokeWidth={3} />
        </div>
        <h1 className="text-[var(--kultzr-text-primary)] mb-3">Order Confirmed!</h1>
        <p className="text-[var(--kultzr-text-muted)] mb-2">Order #{orderNumber}</p>
        <p className="text-[var(--kultzr-text-muted)] mb-8">
          Thank you for your purchase. We'll send you a confirmation email shortly.
        </p>
        <div className="space-y-3">
          <Button
            className="w-full bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)]"
            onClick={() => setCurrentView('profile')}
          >
            View Order Status
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setCurrentView('home')}
          >
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </div>
  );

  // Profile View
  const ProfileView = () => (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-[var(--kultzr-text-primary)] mb-8">My Account</h1>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[var(--kultzr-surface)] mb-8">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="space-y-4">
              {orderNumber && (
                <div className="bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[var(--kultzr-text-muted)] text-[var(--text-sm)] mb-1">
                        Order #{orderNumber}
                      </p>
                      <p className="text-[var(--kultzr-text-primary)]">Confirmed</p>
                    </div>
                    <Badge className="bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] border-0">
                      In Transit
                    </Badge>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <p className="text-[var(--kultzr-text-primary)]">₹{cartTotal.toLocaleString()}</p>
                    <Button variant="outline" size="sm">
                      Track Order
                    </Button>
                  </div>
                </div>
              )}
              <div className="text-center py-12 text-[var(--kultzr-text-muted)]">
                {!orderNumber && 'No orders yet'}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wishlist">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map(productId => {
                const product = MOCK_PRODUCTS.find(p => p.id === productId);
                if (!product) return null;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    onProductClick={(p) => {
                      setSelectedProduct(p);
                      setCurrentView('product-detail');
                    }}
                    isInWishlist={true}
                  />
                );
              })}
            </div>
            {wishlist.length === 0 && (
              <div className="text-center py-12 text-[var(--kultzr-text-muted)]">
                No items in wishlist
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] p-6">
              <h2 className="text-[var(--kultzr-text-primary)] mb-6">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[var(--kultzr-text-primary)] mb-2">Email</label>
                  <Input
                    type="email"
                    defaultValue="user@kultzr.com"
                    className="bg-[var(--kultzr-primary)] border-[var(--border)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--kultzr-text-primary)] mb-2">Name</label>
                  <Input
                    defaultValue="KULTZR User"
                    className="bg-[var(--kultzr-primary)] border-[var(--border)]"
                  />
                </div>
                <Button className="bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)]">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  // Admin Upload View
  const AdminUploadView = () => {
    const [productData, setProductData] = useState({
      name: '',
      price: '',
      category: '',
      description: ''
    });

    return (
      <div className="min-h-screen pb-20">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[var(--kultzr-text-primary)]">Upload Product</h1>
            <Button variant="ghost" onClick={() => setCurrentView('home')}>
              <CloseIcon size={20} />
            </Button>
          </div>

          <div className="bg-[var(--kultzr-surface)] rounded-[var(--radius-md)] p-6">
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-[var(--kultzr-text-primary)] mb-3">Product Images</label>
                <div className="border-2 border-dashed border-[var(--border)] rounded-[var(--radius-md)] p-12 text-center hover:border-[var(--kultzr-accent-neon)] transition-colors cursor-pointer">
                  <UploadIcon size={48} className="mx-auto mb-4 text-[var(--kultzr-text-muted)]" />
                  <p className="text-[var(--kultzr-text-primary)] mb-1">
                    Drop images here or click to browse
                  </p>
                  <p className="text-[var(--kultzr-text-muted)] text-[var(--text-sm)]">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <label className="block text-[var(--kultzr-text-primary)] mb-2">Product Name</label>
                <Input
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  className="bg-[var(--kultzr-primary)] border-[var(--border)]"
                  placeholder="e.g. STEALTH HOODIE"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--kultzr-text-primary)] mb-2">Price (₹)</label>
                  <Input
                    type="number"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    className="bg-[var(--kultzr-primary)] border-[var(--border)]"
                    placeholder="4999"
                  />
                </div>
                <div>
                  <label className="block text-[var(--kultzr-text-primary)] mb-2">Category</label>
                  <Select
                    value={productData.category}
                    onValueChange={(value) => setProductData({ ...productData, category: value })}
                  >
                    <SelectTrigger className="bg-[var(--kultzr-primary)] border-[var(--border)]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hoodies">Hoodies</SelectItem>
                      <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                      <SelectItem value="Footwear">Footwear</SelectItem>
                      <SelectItem value="Bottoms">Bottoms</SelectItem>
                      <SelectItem value="Jackets">Jackets</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--kultzr-text-primary)] mb-2">Description</label>
                <Textarea
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  className="bg-[var(--kultzr-primary)] border-[var(--border)]"
                  placeholder="Product description..."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCurrentView('home')}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)]"
                  onClick={() => {
                    toast.success('Product uploaded successfully!');
                    setCurrentView('home');
                  }}
                >
                  Upload Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Search View
  const SearchView = () => (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('home')}
          >
            <BackIcon size={20} />
          </Button>
          <div className="flex-1 relative">
            <SearchIcon
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--kultzr-text-muted)]"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-[var(--kultzr-surface)] border-[var(--border)] h-12"
              placeholder="Search products..."
              autoFocus
            />
          </div>
        </div>

        {searchQuery && (
          <div>
            <p className="text-[var(--kultzr-text-muted)] mb-6">
              {filteredProducts.length} results for "{searchQuery}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  onProductClick={(p) => {
                    setSelectedProduct(p);
                    setCurrentView('product-detail');
                  }}
                  isInWishlist={wishlist.includes(product.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--kultzr-primary)]">
      <Header
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
        onSearchClick={() => setCurrentView('search')}
        onCartClick={() => setCurrentView('cart')}
        onProfileClick={() => setCurrentView('profile')}
        onWishlistClick={() => setCurrentView('profile')}
        onLogoClick={() => setCurrentView('home')}
        cartItemCount={cartItemCount}
        wishlistCount={wishlist.length}
        isMenuOpen={isMenuOpen}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentView === 'home' && <HomeView />}
          {currentView === 'product-detail' && <ProductDetailView />}
          {currentView === 'cart' && <CartView />}
          {currentView === 'checkout' && <CheckoutView />}
          {currentView === 'order-confirmation' && <OrderConfirmationView />}
          {currentView === 'profile' && <ProfileView />}
          {currentView === 'search' && <SearchView />}
          {currentView === 'admin-upload' && <AdminUploadView />}
        </motion.div>
      </AnimatePresence>

      {/* Floating Action Button - Admin Upload */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setCurrentView('admin-upload')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[var(--kultzr-accent-orange)] text-[var(--kultzr-primary)] rounded-full shadow-kultzr-3 flex items-center justify-center z-40"
      >
        <PlusIcon size={24} strokeWidth={2.5} />
      </motion.button>

      <Toaster />
    </div>
  );
}
