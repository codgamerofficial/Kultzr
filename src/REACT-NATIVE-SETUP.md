# KULTZR - React Native Mobile App Setup

## 📱 React Native App Structure

```
kultzr-mobile/
├── App.tsx
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── AdminUploadScreen.tsx
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   ├── Header.tsx
│   │   └── Button.tsx
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── services/
│   │   ├── supabase.ts
│   │   └── api.ts
│   ├── store/
│   │   └── useStore.ts (Zustand)
│   ├── constants/
│   │   └── theme.ts
│   └── types/
│       └── index.ts
├── assets/
│   └── fonts/
│       ├── Anton-Regular.ttf
│       └── Inter-*.ttf
└── package.json
```

---

## 🚀 Installation

### 1. Create Expo App

```bash
npx create-expo-app kultzr-mobile
cd kultzr-mobile
```

### 2. Install Dependencies

```bash
# Core dependencies
npx expo install @supabase/supabase-js
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-url-polyfill

# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# State management
npm install zustand

# UI & Animation
npx expo install react-native-reanimated react-native-gesture-handler
npm install react-native-svg

# Image handling
npx expo install expo-image expo-image-picker

# Forms
npm install react-hook-form zod @hookform/resolvers

# Additional
npx expo install expo-font
```

### 3. Configure babel.config.js

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

---

## 🎨 Theme Configuration

Create `src/constants/theme.ts`:

```typescript
export const theme = {
  colors: {
    primary: '#0B0B0D',
    surface: '#1E1E20',
    accent: '#A4FF00',
    accentOrange: '#FF6A00',
    text: '#F5F5F5',
    textMuted: '#A8A8A8',
    textMutedDark: '#6B6B6B',
    danger: '#FF3B3B',
    success: '#00FF7A',
    white: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 20,
    pill: 9999,
  },
  
  typography: {
    h1: {
      fontSize: 44,
      lineHeight: 52,
      fontFamily: 'Anton-Regular',
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 32,
      lineHeight: 40,
      fontFamily: 'Anton-Regular',
      fontWeight: '700' as const,
    },
    h3: {
      fontSize: 24,
      lineHeight: 32,
      fontFamily: 'Inter-Bold',
      fontWeight: '700' as const,
    },
    h4: {
      fontSize: 18,
      lineHeight: 24,
      fontFamily: 'Inter-SemiBold',
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Inter-Regular',
      fontWeight: '400' as const,
    },
    sm: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'Inter-Regular',
      fontWeight: '400' as const,
    },
    xs: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: 'Inter-Regular',
      fontWeight: '400' as const,
    },
  },
  
  shadows: {
    elev1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    elev2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    },
    elev3: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 12,
    },
  },
};

export type Theme = typeof theme;
```

---

## 🔐 Supabase Client Setup

Create `src/services/supabase.ts`:

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  badge?: 'NEW' | 'LIMITED' | 'DROP';
  rating?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  mockup_images: string[];
  is_active: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: any;
  items: any[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
  tracking_number?: string;
  tracking_url?: string;
  created_at: string;
}
```

---

## 🛍️ API Service

Create `src/services/api.ts`:

```typescript
import { supabase } from './supabase';

const API_BASE = 'YOUR_SUPABASE_URL/functions/v1/make-server-891a09ab';

// Helper to get auth headers
async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || 'YOUR_ANON_KEY'}`,
  };
}

export const api = {
  // Products
  async getProducts() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/products`, { headers });
    return response.json();
  },

  async getProduct(id: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/products/${id}`, { headers });
    return response.json();
  },

  // Orders
  async createOrder(orderData: any) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  async getUserOrders() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/orders`, { headers });
    return response.json();
  },

  // Wishlist
  async getWishlist() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/wishlist`, { headers });
    return response.json();
  },

  async addToWishlist(productId: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/wishlist`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ product_id: productId }),
    });
    return response.json();
  },

  async removeFromWishlist(productId: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/wishlist/${productId}`, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  },
};
```

---

## 🎯 State Management with Zustand

Create `src/store/useStore.ts`:

```typescript
import { create } from 'zustand';
import { Product } from '../services/supabase';

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, size: string | undefined, delta: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartItemCount: () => number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  
  // User
  user: any;
  setUser: (user: any) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Cart
  cart: [],
  addToCart: (product, size) => {
    const cart = get().cart;
    const existingItem = cart.find(
      item => item.id === product.id && item.selectedSize === size
    );

    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1, selectedSize: size }] });
    }
  },
  
  removeFromCart: (productId, size) => {
    set({
      cart: get().cart.filter(
        item => !(item.id === productId && item.selectedSize === size)
      ),
    });
  },
  
  updateQuantity: (productId, size, delta) => {
    set({
      cart: get().cart
        .map(item => {
          if (item.id === productId && item.selectedSize === size) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter(item => item.quantity > 0),
    });
  },
  
  clearCart: () => set({ cart: [] }),
  
  cartTotal: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  
  cartItemCount: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Wishlist
  wishlist: [],
  toggleWishlist: (productId) => {
    const wishlist = get().wishlist;
    if (wishlist.includes(productId)) {
      set({ wishlist: wishlist.filter(id => id !== productId) });
    } else {
      set({ wishlist: [...wishlist, productId] });
    }
  },

  // User
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

## 📱 Sample Components

### ProductCard Component

Create `src/components/ProductCard.tsx`:

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { Product } from '../services/supabase';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {product.badge && (
          <View style={[
            styles.badge,
            product.badge === 'NEW' && { backgroundColor: theme.colors.accent },
            product.badge === 'LIMITED' && { backgroundColor: theme.colors.accentOrange },
            product.badge === 'DROP' && { backgroundColor: theme.colors.danger },
          ]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={onToggleWishlist}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 20 }}>
            {isInWishlist ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        {product.category && (
          <Text style={styles.category}>{product.category}</Text>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
          {product.rating && (
            <View style={styles.rating}>
              <Text style={styles.ratingText}>★ {product.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    ...theme.shadows.elev1,
  },
  imageContainer: {
    aspectRatio: 3 / 4,
    backgroundColor: theme.colors.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.pill,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: theme.typography.xs.fontSize,
    fontWeight: '700',
  },
  wishlistButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    padding: theme.spacing.md,
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  category: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sm.fontSize,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: theme.colors.accent,
    fontSize: theme.typography.sm.fontSize,
  },
});
```

---

## 🧭 Navigation Setup

Create `src/navigation/AppNavigator.tsx`:

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0B0B0D',
          borderTopColor: 'rgba(255,255,255,0.08)',
        },
        tabBarActiveTintColor: '#A4FF00',
        tabBarInactiveTintColor: '#6B6B6B',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0B0B0D',
          },
          headerTintColor: '#A4FF00',
          headerTitleStyle: {
            fontFamily: 'Anton-Regular',
          },
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen}
          options={{ title: 'Product Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## 🎬 App Entry Point

Update `App.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator';
import { supabase } from './src/services/supabase';
import { useStore } from './src/store/useStore';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const setUser = useStore(state => state.setUser);

  useEffect(() => {
    loadFonts();
    checkAuth();
  }, []);

  async function loadFonts() {
    await Font.loadAsync({
      'Anton-Regular': require('./assets/fonts/Anton-Regular.ttf'),
      'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
      'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
      'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    });
    setFontsLoaded(true);
  }

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }

  if (!fontsLoaded) {
    return null; // Or show splash screen
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
```

---

## 🔧 Additional Setup Steps

### 1. Configure Printful API Key

Add to your edge function environment:
```bash
supabase secrets set PRINTFUL_API_KEY=your_key_here
supabase secrets set PRINTFUL_STORE_ID=your_store_id
```

### 2. Set up Webhooks

In Printful dashboard:
- Go to Settings → Webhooks
- Add webhook URL: `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-891a09ab/webhooks/printful`
- Select events: package_shipped, package_returned, order_failed, stock_updated

### 3. Download Fonts

Place fonts in `assets/fonts/`:
- Anton-Regular.ttf
- Inter-Regular.ttf
- Inter-Bold.ttf
- Inter-SemiBold.ttf

### 4. Run Development

```bash
npx expo start
```

---

## 🚀 Production Deployment

### iOS
```bash
eas build --platform ios
eas submit --platform ios
```

### Android
```bash
eas build --platform android
eas submit --platform android
```

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Supabase React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Printful API](https://developers.printful.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Next:** Implement screens and connect to backend!
