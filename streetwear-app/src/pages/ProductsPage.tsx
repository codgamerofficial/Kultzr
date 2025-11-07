import React from 'react'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'

const ProductsPage: React.FC = () => {
  const { products, loading, filters, setFilters } = useProducts()

  return (
    <div className="min-h-screen py-20">
      <div className="container-street">
        <h1 className="section-title">ALL PRODUCTS</h1>
        
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as any })}
            className="input"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="street-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton aspect-product" />
            ))}
          </div>
        ) : (
          <div className="street-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage