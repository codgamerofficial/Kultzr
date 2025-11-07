import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

// Mock search results
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'STEALTH HOODIE',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1629097499121-290fd9a95dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMG1pbmltYWx8ZW58MXx8fHwxNzYyNTIyMzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Hoodies'
  },
  {
    id: '2',
    name: 'GHOST RIDER TEE',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMHByb2R1Y3R8ZW58MXx8fHwxNzYyNTIyMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'T-Shirts'
  }
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = MOCK_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0b0b0d', '#1e1e20']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SEARCH</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#a8a8a8"
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
        </View>

        {/* Search Results */}
        {searchQuery && (
          <View style={styles.resultsContainer}>
            {searchResults.length > 0 ? (
              <>
                <Text style={styles.resultsText}>
                  {searchResults.length} results for "{searchQuery}"
                </Text>
                <FlatList
                  data={searchResults}
                  renderItem={renderProduct}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.resultsList}
                />
              </>
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching for different keywords
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <View style={styles.popularSearches}>
            <Text style={styles.popularTitle}>POPULAR SEARCHES</Text>
            <View style={styles.popularTags}>
              {['Hoodies', 'T-Shirts', 'Sneakers', 'Caps', 'Jackets'].map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tag}
                  onPress={() => handleSearch(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  placeholder: {
    width: 40,
  },
  searchContainer: {
    padding: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e20',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#f5f5f5',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsText: {
    color: '#a8a8a8',
    fontSize: 14,
    marginBottom: 16,
  },
  resultsList: {
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#1e1e20',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    backgroundColor: '#a8a8a8',
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCategory: {
    color: '#a8a8a8',
    fontSize: 12,
    marginBottom: 4,
  },
  productPrice: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: '600',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsText: {
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    color: '#a8a8a8',
    fontSize: 14,
    textAlign: 'center',
  },
  popularSearches: {
    padding: 20,
  },
  popularTitle: {
    color: '#a8a8a8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1e1e20',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff14',
  },
  tagText: {
    color: '#f5f5f5',
    fontSize: 12,
  },
});