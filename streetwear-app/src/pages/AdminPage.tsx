import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Plus,
  RefreshCw,
  Download,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { db } from '../utils/supabase'
import { printfulService } from '../services/printfulService'

interface AdminStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  activeUsers: number
  pendingOrders: number
  lowStockItems: number
}

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  image?: string
  isActive: boolean
}

export default function AdminPage() {
  const { user } = useAuth()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
    lowStockItems: 0
  })
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [syncStatus, setSyncStatus] = useState<any>(null)

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      // Redirect non-authenticated users
      window.location.href = '/'
    }
  }, [user])

  // Load admin data
  useEffect(() => {
    if (user) {
      loadAdminData()
      loadSyncStatus()
      loadOrders()
      loadProducts()
    }
  }, [user])

  // Load statistics
  const loadAdminData = async () => {
    try {
      setIsLoading(true)
      
      // Load all data in parallel
      const [productStats, orderStats] = await Promise.all([
        db.getProductStats(),
        db.getOrderStats()
      ])

      // Calculate statistics
      const totalProducts = productStats.data?.length || 0
      const totalOrders = orderStats.data?.length || 0
      const totalRevenue = orderStats.data?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0
      const pendingOrders = orderStats.data?.filter((order: any) => order.status === 'pending').length || 0
      const lowStockItems = productStats.data?.filter((product: any) => product.stock_quantity < 10).length || 0

      setStats({
        totalProducts,
        totalOrders,
        totalRevenue,
        activeUsers: 0, // Would need user analytics
        pendingOrders,
        lowStockItems
      })
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load orders
  const loadOrders = async () => {
    try {
      const { data, error } = await db.getUserOrders(user?.id || '')
      if (!error && data) {
        setOrders(data)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  // Load products
  const loadProducts = async () => {
    try {
      const { data, error } = await db.getProducts()
      if (!error && data) {
        setProducts(data as Product[])
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  // Load Printful sync status
  const loadSyncStatus = async () => {
    try {
      const status = await printfulService.getSyncStatus()
      setSyncStatus(status)
    } catch (error) {
      console.error('Error loading sync status:', error)
    }
  }

  // Sync with Printful
  const handlePrintfulSync = async () => {
    try {
      setIsLoading(true)
      const result = await printfulService.syncProducts()
      
      if (result.success) {
        await loadAdminData()
        await loadSyncStatus()
        alert(`Sync completed! ${result.products_synced} products synced, ${result.products_created} created, ${result.products_updated} updated.`)
      } else {
        alert(`Sync failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error syncing with Printful:', error)
      alert('Sync failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await db.updateOrderStatus(orderId, newStatus)
      await loadOrders()
      await loadAdminData()
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  // Export orders
  const exportOrders = () => {
    const csv = [
      ['Order ID', 'Customer', 'Status', 'Total', 'Date', 'Payment'],
      ...orders.map((order: any) => [
        order.id,
        order.user_name || 'Guest',
        order.status,
        order.total,
        new Date(order.created_at).toLocaleDateString(),
        order.payment_status
      ])
    ].map((row: any[]) => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Filter orders
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--kultzr-primary)] text-[var(--kultzr-text-primary)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--kultzr-text-primary)] mb-2">Admin Dashboard</h1>
            <p className="text-[var(--kultzr-text-muted)]">Manage your streetwear store</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrintfulSync}
              disabled={isLoading}
              className="bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
              aria-label="Sync with Printful"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Sync Printful
            </button>
            <button
              onClick={exportOrders}
              className="border border-[var(--kultzr-accent-neon)] text-[var(--kultzr-accent-neon)] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--kultzr-accent-neon)] hover:text-[var(--kultzr-primary)] transition-colors"
              aria-label="Export orders"
            >
              <Download className="w-4 h-4" />
              Export Orders
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--kultzr-surface)] border border-[var(--kultzr-accent-neon)]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[var(--kultzr-text-muted)]">Total Products</p>
              <Package className="h-4 w-4 text-[var(--kultzr-accent-neon)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--kultzr-text-primary)]">{stats.totalProducts}</div>
            {stats.lowStockItems > 0 && (
              <p className="text-xs text-[var(--kultzr-accent-orange)] mt-1">
                {stats.lowStockItems} items low on stock
              </p>
            )}
          </div>

          <div className="bg-[var(--kultzr-surface)] border border-[var(--kultzr-accent-neon)]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[var(--kultzr-text-muted)]">Total Orders</p>
              <ShoppingBag className="h-4 w-4 text-[var(--kultzr-accent-neon)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--kultzr-text-primary)]">{stats.totalOrders}</div>
            {stats.pendingOrders > 0 && (
              <p className="text-xs text-[var(--kultzr-accent-orange)] mt-1">
                {stats.pendingOrders} pending orders
              </p>
            )}
          </div>

          <div className="bg-[var(--kultzr-surface)] border border-[var(--kultzr-accent-neon)]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[var(--kultzr-text-muted)]">Total Revenue</p>
              <DollarSign className="h-4 w-4 text-[var(--kultzr-accent-neon)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--kultzr-text-primary)]">
              ₹{stats.totalRevenue.toLocaleString()}
            </div>
          </div>

          <div className="bg-[var(--kultzr-surface)] border border-[var(--kultzr-accent-neon)]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[var(--kultzr-text-muted)]">Active Users</p>
              <Users className="h-4 w-4 text-[var(--kultzr-accent-neon)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--kultzr-text-primary)]">{stats.activeUsers}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-[var(--kultzr-surface)] p-1 rounded-lg">
            {['overview', 'products', 'orders', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)]'
                    : 'text-[var(--kultzr-text-muted)] hover:text-[var(--kultzr-text-primary)]'
                }`}
                aria-label={`View ${tab} tab`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-[var(--kultzr-surface)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--kultzr-text-primary)] mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-[var(--kultzr-primary)] rounded-lg">
                      <div>
                        <p className="font-medium text-[var(--kultzr-text-primary)]">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-[var(--kultzr-text-muted)]">{order.user_name || 'Guest'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[var(--kultzr-text-primary)]">₹{order.total}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-[var(--kultzr-accent-orange)] text-white'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sync Status */}
              <div className="bg-[var(--kultzr-surface)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--kultzr-text-primary)] mb-4">Printful Integration</h3>
                {syncStatus ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--kultzr-text-muted)]">Last Sync:</span>
                      <span className="text-[var(--kultzr-text-primary)]">
                        {new Date(syncStatus.last_sync).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--kultzr-text-muted)]">Products Synced:</span>
                      <span className="text-[var(--kultzr-text-primary)]">{syncStatus.sync_count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--kultzr-text-muted)]">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        syncStatus.success ? 'bg-green-500' : 'bg-red-500'
                      } text-white`}>
                        {syncStatus.success ? 'Connected' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[var(--kultzr-text-muted)]">No sync data available</p>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[var(--kultzr-text-primary)]">Products</h2>
                <button className="bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              <div className="bg-[var(--kultzr-surface)] rounded-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kultzr-text-muted)] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[var(--kultzr-primary)] border border-[var(--kultzr-accent-neon)]/20 rounded-lg text-[var(--kultzr-text-primary)]"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--kultzr-accent-neon)]/20">
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Product</th>
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Category</th>
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Price</th>
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Stock</th>
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Status</th>
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product: Product) => (
                        <tr key={product.id} className="border-b border-[var(--kultzr-accent-neon)]/20">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[var(--kultzr-primary)] rounded-lg overflow-hidden">
                                {product.image && (
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-[var(--kultzr-text-primary)]">{product.name}</p>
                                <p className="text-sm text-[var(--kultzr-text-muted)]">{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[var(--kultzr-text-primary)]">{product.category}</td>
                          <td className="py-3 px-4 text-[var(--kultzr-text-primary)]">₹{product.price}</td>
                          <td className="py-3 px-4 text-[var(--kultzr-text-primary)]">{product.stock || 0}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              product.isActive 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-500 text-white'
                            }`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button 
                                className="p-1 hover:bg-[var(--kultzr-primary)] rounded"
                                aria-label="View product"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                className="p-1 hover:bg-[var(--kultzr-primary)] rounded"
                                aria-label="More actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[var(--kultzr-text-primary)]">Orders</h2>
              </div>

              <div className="bg-[var(--kultzr-surface)] rounded-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kultzr-text-muted)] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[var(--kultzr-primary)] border border-[var(--kultzr-accent-neon)]/20 rounded-lg text-[var(--kultzr-text-primary)]"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-[var(--kultzr-primary)] border border-[var(--kultzr-accent-neon)]/20 rounded-lg text-[var(--kultzr-text-primary)]"
                    title="Filter orders by status"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--kultzr-accent-neon)]/20">
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Order ID</th>
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Customer</th>
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Status</th>
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Total</th>
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Date</th>
                        <th className="text-left py-3 px-4 text-[var(--kultzr-text-muted)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order: any) => (
                        <tr key={order.id} className="border-b border-[var(--kultzr-accent-neon)]/20">
                          <td className="py-3 px-4 font-mono text-[var(--kultzr-text-primary)]">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="py-3 px-4 text-[var(--kultzr-text-primary)]">
                            {order.user_name || 'Guest'}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="px-2 py-1 bg-[var(--kultzr-primary)] border border-[var(--kultzr-accent-neon)]/20 rounded text-[var(--kultzr-text-primary)]"
                              title="Update order status"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-[var(--kultzr-text-primary)]">₹{order.total}</td>
                          <td className="py-3 px-4 text-[var(--kultzr-text-primary)]">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <button 
                              className="p-1 hover:bg-[var(--kultzr-primary)] rounded"
                              aria-label="View order details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-[var(--kultzr-surface)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--kultzr-text-primary)] mb-6">Integration Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-[var(--kultzr-text-primary)] mb-4">Printful Integration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--kultzr-text-muted)] mb-2">API Key</label>
                      <input
                        type="password"
                        placeholder="Enter Printful API key"
                        className="w-full px-3 py-2 bg-[var(--kultzr-primary)] border border-[var(--kultzr-accent-neon)]/20 rounded-lg text-[var(--kultzr-text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--kultzr-text-muted)] mb-2">Sync Frequency</label>
                      <select 
                        className="w-full px-3 py-2 bg-[var(--kultzr-primary)] border border-[var(--kultzr-accent-neon)]/20 rounded-lg text-[var(--kultzr-text-primary)]"
                        title="Select sync frequency"
                      >
                        <option value="manual">Manual</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                  </div>
                  <button className="mt-4 bg-[var(--kultzr-accent-neon)] text-[var(--kultzr-primary)] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}