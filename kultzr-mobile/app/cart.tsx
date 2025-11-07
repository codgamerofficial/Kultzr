import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

// Mock cart data
const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'STEALTH HOODIE',
    price: 4999,
    quantity: 1,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1629097499121-290fd9a95dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMG1pbmltYWx8ZW58MXx8fHwxNzYyNTIyMzAwfDA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0b0b0d', '#1e1e20']}
          style={styles.gradient}
        >
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartIcon}>🛒</Text>
            <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtitle}>Add some items to get started</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.browseButtonText}>BROWSE PRODUCTS</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0b0b0d', '#1e1e20']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SHOPPING CART</Text>
          <Text style={styles.headerSubtitle}>{cartItemCount} items</Text>
        </View>

        <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.size && (
                  <Text style={styles.itemSize}>Size: {item.size}</Text>
                )}
                <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
                
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item.id)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({cartItemCount} items)</Text>
            <Text style={styles.summaryValue}>₹{cartTotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {cartTotal > 2999 ? 'FREE' : '₹99'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₹{(cartTotal + (cartTotal > 2999 ? 0 : 99)).toLocaleString()}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => router.push('/checkout')}
          >
            <Text style={styles.checkoutButtonText}>PROCEED TO CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0d',
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff14',
  },
  headerTitle: {
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#a8a8a8',
    fontSize: 14,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyCartTitle: {
    color: '#f5f5f5',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    color: '#a8a8a8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#a4ff00',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#0b0b0d',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cartList: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#1e1e20',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemSize: {
    color: '#a8a8a8',
    fontSize: 12,
    marginBottom: 4,
  },
  itemPrice: {
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0b0b0d',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#a4ff00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    color: '#f5f5f5',
    fontSize: 14,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#a8a8a8',
    fontSize: 20,
  },
  orderSummary: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ffffff14',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#a8a8a8',
    fontSize: 14,
  },
  summaryValue: {
    color: '#f5f5f5',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ffffff14',
    marginVertical: 12,
  },
  totalLabel: {
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#a4ff00',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#0b0b0d',
    fontSize: 14,
    fontWeight: 'bold',
  },
});