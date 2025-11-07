import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Product {
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

// Mock product detail
const MOCK_PRODUCT: Product = {
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
};

const mockImages = [
  'https://images.unsplash.com/photo-1629097499121-290fd9a95dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMG1pbmltYWx8ZW58MXx8fHwxNzYyNTIyMzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1579758629937-03637cc8ba2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWF2eS1jb2F0ZS1ibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3NjI0NzQ0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1580742474702-c2e55f2129e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMG9wZW58ZW58MXx8fHwxNzYyNDc0NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080'
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(MOCK_PRODUCT.colors?.[0] || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    if (MOCK_PRODUCT.sizes && MOCK_PRODUCT.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    // Add to cart logic
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0b0b0d', '#1e1e20']}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>PRODUCT DETAILS</Text>
            <TouchableOpacity style={styles.wishlistButton}>
              <Text style={styles.wishlistButtonText}>♡</Text>
            </TouchableOpacity>
          </View>

          {/* Image Gallery */}
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
            >
              {mockImages.map((image, index) => (
                <View key={index} style={[styles.imageSlide, { width }]}>
                  <Image source={{ uri: image }} style={styles.productImage} />
                  {MOCK_PRODUCT.badge && (
                    <View style={[
                      styles.badge,
                      MOCK_PRODUCT.badge === 'NEW' && styles.badgeNew,
                      MOCK_PRODUCT.badge === 'LIMITED' && styles.badgeLimited,
                      MOCK_PRODUCT.badge === 'DROP' && styles.badgeDrop
                    ]}>
                      <Text style={styles.badgeText}>{MOCK_PRODUCT.badge}</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.imageDots}>
              {mockImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentImageIndex === index && styles.dotActive
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.productName}>{MOCK_PRODUCT.name}</Text>
              <Text style={styles.productCategory}>{MOCK_PRODUCT.category}</Text>
            </View>

            {MOCK_PRODUCT.rating && (
              <View style={styles.ratingRow}>
                <Text style={styles.rating}>★ {MOCK_PRODUCT.rating.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>(234 reviews)</Text>
              </View>
            )}

            <Text style={styles.productPrice}>₹{MOCK_PRODUCT.price.toLocaleString()}</Text>

            <Text style={styles.productDescription}>{MOCK_PRODUCT.description}</Text>

            {/* Size Selection */}
            {MOCK_PRODUCT.sizes && MOCK_PRODUCT.sizes.length > 0 && (
              <View style={styles.sizeSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>SELECT SIZE</Text>
                  <TouchableOpacity>
                    <Text style={styles.sizeGuide}>SIZE GUIDE</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.sizeGrid}>
                  {MOCK_PRODUCT.sizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        selectedSize === size && styles.sizeButtonActive
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text style={[
                        styles.sizeButtonText,
                        selectedSize === size && styles.sizeButtonTextActive
                      ]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Color Selection */}
            {MOCK_PRODUCT.colors && MOCK_PRODUCT.colors.length > 0 && (
              <View style={styles.colorSection}>
                <Text style={styles.sectionTitle}>COLOR</Text>
                <View style={styles.colorGrid}>
                  {MOCK_PRODUCT.colors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorButtonActive
                      ]}
                      onPress={() => setSelectedColor(color)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                <Text style={styles.addToCartButtonText}>ADD TO CART</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buyNowButton}>
                <Text style={styles.buyNowButtonText}>BUY NOW</Text>
              </TouchableOpacity>
            </View>

            {/* Features */}
            <View style={styles.features}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🚚</Text>
                <Text style={styles.featureText}>Free shipping on orders over ₹2,999</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📦</Text>
                <Text style={styles.featureText}>Estimated delivery: 3-5 business days</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Easy 30-day returns</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff14',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#f5f5f5',
    fontSize: 20,
  },
  headerTitle: {
    color: '#a4ff00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  wishlistButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistButtonText: {
    color: '#f5f5f5',
    fontSize: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  imageSlide: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 400,
  },
  badge: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeNew: {
    backgroundColor: '#a4ff00',
  },
  badgeLimited: {
    backgroundColor: '#ff6a00',
  },
  badgeDrop: {
    backgroundColor: '#ff3b3b',
  },
  badgeText: {
    color: '#0b0b0d',
    fontSize: 10,
    fontWeight: 'bold',
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff33',
  },
  dotActive: {
    backgroundColor: '#a4ff00',
  },
  productInfo: {
    padding: 20,
  },
  titleRow: {
    marginBottom: 12,
  },
  productName: {
    color: '#f5f5f5',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCategory: {
    color: '#a8a8a8',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  rating: {
    color: '#a4ff00',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCount: {
    color: '#a8a8a8',
    fontSize: 12,
  },
  productPrice: {
    color: '#f5f5f5',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productDescription: {
    color: '#a8a8a8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: '600',
  },
  sizeGuide: {
    color: '#a4ff00',
    fontSize: 12,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ffffff14',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: '#a4ff00',
    borderColor: '#a4ff00',
  },
  sizeButtonText: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: '600',
  },
  sizeButtonTextActive: {
    color: '#0b0b0d',
  },
  colorSection: {
    marginBottom: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffffff14',
  },
  colorButtonActive: {
    borderColor: '#a4ff00',
    transform: [{ scale: 1.1 }],
  },
  actionButtons: {
    marginBottom: 24,
  },
  addToCartButton: {
    backgroundColor: '#a4ff00',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addToCartButtonText: {
    color: '#0b0b0d',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buyNowButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff14',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyNowButtonText: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: '600',
  },
  features: {
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 16,
  },
  featureText: {
    color: '#a8a8a8',
    fontSize: 12,
  },
});