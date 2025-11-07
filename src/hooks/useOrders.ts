import { useState, useEffect } from 'react';
import { supabase, Order, OrderItem, CartItemWithDetails, ApiResponse } from '../utils/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CreateOrderData {
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  billingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  shippingMethod: string;
  notes?: string;
  customerNotes?: string;
}

export interface UseOrdersReturn {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  getOrders: () => Promise<void>;
  getOrder: (id: string) => Promise<Order | null>;
  createOrder: (cartItems: CartItemWithDetails[], orderData: CreateOrderData) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  trackOrder: (orderId: string) => Promise<any>;
  getOrderByNumber: (orderNumber: string) => Promise<Order | null>;
  refreshOrders: () => Promise<void>;
}

export function useOrders(): UseOrdersReturn {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `KLTZ${timestamp}${random}`;
  };

  const getOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products(*),
            variant:product_variants(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getOrder = async (orderId: string): Promise<Order | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products(*),
            variant:product_variants(*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data;
    } catch (err) {
      console.error('Error fetching order:', err);
      return null;
    }
  };

  const createOrder = async (
    cartItems: CartItemWithDetails[],
    orderData: CreateOrderData
  ): Promise<Order | null> => {
    if (!user) {
      throw new Error('User must be logged in to create order');
    }

    try {
      setIsLoading(true);

      // Calculate order totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.product.price * item.quantity), 0
      );
      
      const shippingAmount = subtotal >= 2999 ? 0 : 99; // Free shipping over ₹2999
      const taxAmount = Math.round(subtotal * 0.18); // 18% GST
      const totalAmount = subtotal + shippingAmount + taxAmount;

      // Generate unique order number
      const orderNumber = generateOrderNumber();

      // Create order
      const orderPayload = {
        order_number: orderNumber,
        user_id: user.id,
        status: 'pending' as const,
        fulfillment_status: 'unfulfilled' as const,
        payment_status: 'pending' as const,
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        discount_amount: 0,
        total_amount: totalAmount,
        currency: 'INR',
        shipping_address: orderData.shippingAddress,
        billing_address: orderData.billingAddress || orderData.shippingAddress,
        shipping_method: orderData.shippingMethod,
        shipping_amount,
        payment_method: 'razorpay',
        payment_gateway: 'razorpay',
        notes: orderData.notes,
        customer_notes: orderData.customerNotes,
        order_date: new Date().toISOString(),
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = cartItems.map((cartItem) => ({
        order_id: order.id,
        product_id: cartItem.product_id,
        variant_id: cartItem.variant_id,
        quantity: cartItem.quantity,
        unit_price: cartItem.product.price,
        total_price: cartItem.product.price * cartItem.quantity,
        product_name: cartItem.product.name,
        variant_details: cartItem.variant ? {
          size: cartItem.variant.size,
          color: cartItem.variant.color,
          sku: cartItem.variant.sku
        } : null,
        product_sku: cartItem.product.sku,
        variant_sku: cartItem.variant?.sku
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Clear user's cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      // Update product sales count
      for (const item of cartItems) {
        await supabase
          .from('products')
          .update({ 
            total_sold: (item.product.total_sold || 0) + item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.product_id);
      }

      setCurrentOrder(order);
      toast.success('Order created successfully!');
      
      return order;
    } catch (err) {
      console.error('Error creating order:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      // Add specific timestamps based on status
      switch (status) {
        case 'confirmed':
          updateData.order_date = new Date().toISOString();
          break;
        case 'processing':
          updateData.payment_status = 'paid';
          break;
        case 'shipped':
          updateData.shipped_at = new Date().toISOString();
          break;
        case 'delivered':
          updateData.delivered_at = new Date().toISOString();
          break;
        case 'cancelled':
          updateData.cancelled_at = new Date().toISOString();
          updateData.payment_status = 'failed';
          break;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, ...updateData } : order
        )
      );

      if (currentOrder?.id === orderId) {
        setCurrentOrder(prev => prev ? { ...prev, ...updateData } : null);
      }

      toast.success('Order status updated successfully');
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status');
    }
  };

  const cancelOrder = async (orderId: string, reason?: string): Promise<void> => {
    try {
      await updateOrderStatus(orderId, 'cancelled');
      
      // Add cancellation reason to notes
      if (reason) {
        await supabase
          .from('orders')
          .update({ 
            notes: `Cancelled: ${reason}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);
      }

      // Restore inventory (for non-fulfilled orders)
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (orderItems) {
        for (const item of orderItems) {
          if (item.variant_id) {
            // Restore variant stock
            const { data: variant } = await supabase
              .from('product_variants')
              .select('stock_quantity')
              .eq('id', item.variant_id)
              .single();

            if (variant) {
              await supabase
                .from('product_variants')
                .update({ 
                  stock_quantity: variant.stock_quantity + item.quantity,
                  updated_at: new Date().toISOString()
                })
                .eq('id', item.variant_id);
            }
          }
        }
      }

      toast.success('Order cancelled successfully');
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('Failed to cancel order');
    }
  };

  const trackOrder = async (orderId: string) => {
    try {
      const order = await getOrder(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Get tracking information
      const trackingInfo = {
        orderNumber: order.order_number,
        status: order.status,
        estimatedDelivery: order.shipped_at 
          ? new Date(new Date(order.shipped_at).getTime() + 5 * 24 * 60 * 60 * 1000)
          : new Date(new Date(order.order_date).getTime() + 7 * 24 * 60 * 60 * 1000),
        trackingNumber: order.shipping_tracking_number,
        milestones: [
          {
            status: 'pending',
            date: order.created_at,
            description: 'Order placed'
          },
          {
            status: 'confirmed',
            date: order.order_date,
            description: 'Order confirmed'
          },
          ...(order.shipped_at ? [{
            status: 'shipped',
            date: order.shipped_at,
            description: 'Order shipped'
          }] : []),
          ...(order.delivered_at ? [{
            status: 'delivered',
            date: order.delivered_at,
            description: 'Order delivered'
          }] : [])
        ]
      };

      return trackingInfo;
    } catch (err) {
      console.error('Error tracking order:', err);
      return null;
    }
  };

  const getOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products(*),
            variant:product_variants(*)
          )
        `)
        .eq('order_number', orderNumber)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error fetching order by number:', err);
      return null;
    }
  };

  const refreshOrders = async () => {
    await getOrders();
  };

  useEffect(() => {
    if (user) {
      getOrders();
    } else {
      setOrders([]);
      setCurrentOrder(null);
    }
  }, [user]);

  return {
    orders,
    currentOrder,
    isLoading,
    error,
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    trackOrder,
    getOrderByNumber,
    refreshOrders
  };
}

// Hook for order management (admin)
export function useOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0
  });

  const getAllOrders = async (filters?: {
    status?: Order['status'];
    dateRange?: { from: string; to: string };
    search?: string;
  }) => {
    try {
      setIsLoading(true);

      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products(*),
            variant:product_variants(*)
          ),
          user:profiles(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.from)
          .lte('created_at', filters.dateRange.to);
      }

      if (filters?.search) {
        query = query.or(`order_number.ilike.%${filters.search}%,shipping_address->>name.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching all orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderStats = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status, total_amount, created_at');

      if (error) {
        throw error;
      }

      const stats = {
        totalOrders: data.length,
        pendingOrders: data.filter(o => o.status === 'pending').length,
        completedOrders: data.filter(o => o.status === 'delivered').length,
        cancelledOrders: data.filter(o => o.status === 'cancelled').length,
        totalRevenue: data
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + o.total_amount, 0)
      };

      setStats(stats);
    } catch (err) {
      console.error('Error fetching order stats:', err);
    }
  };

  const updateOrderFulfillment = async (orderId: string, status: Order['fulfillment_status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          fulfillment_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, fulfillment_status: status }
            : order
        )
      );

      toast.success('Order fulfillment status updated');
    } catch (err) {
      console.error('Error updating order fulfillment:', err);
      toast.error('Failed to update fulfillment status');
    }
  };

  const addTrackingInfo = async (orderId: string, trackingNumber: string, carrier: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          shipping_tracking_number: trackingNumber,
          carrier,
          status: 'shipped',
          shipped_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                shipping_tracking_number: trackingNumber,
                status: 'shipped' as Order['status'],
                shipped_at: new Date().toISOString()
              }
            : order
        )
      );

      toast.success('Tracking information added successfully');
    } catch (err) {
      console.error('Error adding tracking info:', err);
      toast.error('Failed to add tracking information');
    }
  };

  const exportOrders = async (filters?: any) => {
    try {
      const { data: orders } = await getAllOrders(filters);
      
      // Convert to CSV format
      const csvContent = [
        ['Order Number', 'Date', 'Customer', 'Total', 'Status', 'Payment Status'].join(','),
        ...orders.map(order => [
          order.order_number,
          new Date(order.created_at).toLocaleDateString(),
          order.shipping_address?.name || 'N/A',
          order.total_amount,
          order.status,
          order.payment_status
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Orders exported successfully');
    } catch (err) {
      console.error('Error exporting orders:', err);
      toast.error('Failed to export orders');
    }
  };

  useEffect(() => {
    getAllOrders();
    getOrderStats();
  }, []);

  return {
    orders,
    stats,
    isLoading,
    getAllOrders,
    getOrderStats,
    updateOrderFulfillment,
    addTrackingInfo,
    exportOrders
  };
}
