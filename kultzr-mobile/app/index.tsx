import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: 'NEW' | 'LIMITED' | 'DROP';
  rating?: number;
  category?: string;
}

// Mock product data matching the web app
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'STEALTH HOODIE',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1629097499121-290fd9a95dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMG1pbmltYWx8ZW58MXx8fHwxNzYyNTIyMzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'NEW',
    rating: 4.8,
    category: 'Hoodies'
  },
  {
    id: '2',
    name: 'GHOST RIDER TEE',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMHByb2R1Y3R8ZW58MXx8fHwxNzYyNTIyMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'LIMITED',
    rating: 4.6,
    category: 'T-Shirts'
  },
  {
    id: '3',
    name: 'CLOUD WALKER',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1573875133340-0b589f59a8c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwbWluaW1hbHxlbnwxfHx8fDE3NjI0ODgyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    category: 'Footwear'
  }
];

const categories = ['ALL', 'HOODIES', 'T-SHIRTS', 'FOOTWEAR', 'BOTTOMS', 'JACKETS', 'ACCESSORIES'];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cartItemCount, setCartItemCount] = useState(0);

  const filteredProducts = MOCK_PRODUCTS.filter(product => 
    selectedCategory === 'ALL' || product.category?.toUpperCase() === selectedCategory
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.badge && (
          <View style={[
            styles.badge,
            item.badge === 'NEW' && styles.badgeNew,
            item.badge === 'LIMITED' && styles.badgeLimited,
            item.badge === 'DROP' && styles.badgeDrop
          ]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★</Text>
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.categoryChipActive
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.categoryTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0b0b0d', '#1e1e20']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>[KULTZR]</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.headerButtonText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/cart')}
            >
              <Text style={styles.headerButtonText}>🛒</Text>
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.headerButtonText}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>STREET</Text>
          <Text style={styles.heroTitleAccent}>CULTURE</Text>
          <Text style={styles.heroSubtitle}>
            Redefining urban fashion. Limited drops. Authentic culture.
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>EXPLORE COLLECTION</Text>
          </TouchableOpacity>
        </View>

        {/* Drop Banner */}
        <View style={styles.dropBanner}>
          <Text style={styles.dropText}>
            🔥 NEW DROP: <Text style={styles.dropHighlight}>NIGHT BOMBER</Text> — Releasing Nov 15, 2024
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({ item }) => renderCategory(item)}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Products Grid */}
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsContainer}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a4ff00',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    position: 'relative',
  },
  headerButtonText: {
    fontSize: 20,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#a4ff00',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#0b0b0d',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f5f5f5',
    textAlign: 'center',
    lineHeight: 40,
  },
  heroTitleAccent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#a4ff00',
    textAlign: 'center',
    lineHeight: 40,
  },
  heroSubtitle: {
    color: '#a8a8a8',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 25,
    fontSize: 14,
  },
  ctaButton: {
    backgroundColor: '#a4ff00',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#0b0b0d',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dropBanner: {
    backgroundColor: '#ff6a00',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dropText: {
    color: '#0b0b0d',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  dropHighlight: {
    fontWeight: 'bold',
  },
  categoryContainer: {
    paddingVertical: 15,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff14',
    backgroundColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: '#a4ff00',
    borderColor: '#a4ff00',
  },
  categoryText: {
    color: '#f5f5f5',
    fontSize: 12,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#0b0b0d',
  },
  productsContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    width: (width - 45) / 2,
    backgroundColor: '#1e1e20',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    aspectRatio: 3/4,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
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
  productInfo: {
    padding: 12,
  },
  productName: {
    color: '#f5f5f5',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCategory: {
    color: '#a8a8a8',
    fontSize: 10,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: '#a4ff00',
    fontSize: 12,
  },
  ratingText: {
    color: '#a8a8a8',
    fontSize: 10,
  },
});