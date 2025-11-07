import { useState, useEffect, useRef } from 'react';
import { supabase, Product, Order } from '../utils/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface NotificationMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, any>;
  actions?: Array<{
    label: string;
    action: () => void;
    style: 'primary' | 'secondary' | 'danger';
  }>;
}

export interface RealtimeEvent {
  type: 'product_updated' | 'order_status_changed' | 'inventory_low' | 'new_review' | 'promotion' | 'system';
  payload: any;
  timestamp: string;
}

export function useRealtimeNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time changes
    const channel = supabase
      .channel('kultzr-notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        handleOrderUpdate(payload.new as Order);
      })
      .on('broadcast', { event: 'product_update' }, ({ payload }) => {
        handleProductUpdate(payload);
      })
      .on('broadcast', { event: 'system_notification' }, ({ payload }) => {
        handleSystemNotification(payload);
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        console.log('Realtime connection status:', status);
      });

    channelRef.current = channel;

    // Load existing notifications
    loadNotifications();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [user]);

  const loadNotifications = async () => {
    try {
      // For demo, create some sample notifications
      const sampleNotifications: NotificationMessage[] = [
        {
          id: '1',
          type: 'success',
          title: 'Order Confirmed!',
          message: 'Your order #KLTZ12345678 has been confirmed and is being prepared.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          data: { orderId: 'order-123' }
        },
        {
          id: '2',
          type: 'info',
          title: 'New Drop Available',
          message: 'Limited edition NIGHT BOMBER is now available for pre-order!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
          data: { productId: 'night-bomber' }
        }
      ];

      setNotifications(sampleNotifications);
      setUnreadCount(sampleNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleOrderUpdate = (order: Order) => {
    const notification: NotificationMessage = {
      id: `order-${order.id}-${Date.now()}`,
      type: order.status === 'delivered' ? 'success' : 'info',
      title: getOrderStatusTitle(order.status),
      message: getOrderStatusMessage(order.status, order.order_number),
      timestamp: new Date(),
      read: false,
      data: { orderId: order.id, status: order.status }
    };

    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast(notification.title, {
      description: notification.message
    });
  };

  const handleProductUpdate = (payload: any) => {
    const notification: NotificationMessage = {
      id: `product-${payload.productId}-${Date.now()}`,
      type: 'info',
      title: 'Product Update',
      message: payload.message || 'A product you\'re interested in has been updated.',
      timestamp: new Date(),
      read: false,
      data: payload
    };

    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const handleSystemNotification = (payload: any) => {
    const notification: NotificationMessage = {
      id: `system-${Date.now()}`,
      type: payload.type || 'info',
      title: payload.title,
      message: payload.message,
      timestamp: new Date(),
      read: false,
      data: payload.data
    };

    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const getOrderStatusTitle = (status: string): string => {
    switch (status) {
      case 'confirmed': return 'Order Confirmed';
      case 'processing': return 'Processing Your Order';
      case 'shipped': return 'Your Order Shipped';
      case 'delivered': return 'Order Delivered!';
      case 'cancelled': return 'Order Cancelled';
      default: return 'Order Update';
    }
  };

  const getOrderStatusMessage = (status: string, orderNumber: string): string => {
    switch (status) {
      case 'confirmed': return `Order #${orderNumber} has been confirmed and is being prepared.`;
      case 'processing': return `Order #${orderNumber} is being processed and will ship soon.`;
      case 'shipped': return `Order #${orderNumber} has been shipped and is on its way!`;
      case 'delivered': return `Order #${orderNumber} has been delivered. Hope you love it!`;
      case 'cancelled': return `Order #${orderNumber} has been cancelled.`;
      default: return `Order #${orderNumber} has been updated.`;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const sendNotification = (type: string, payload: any) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: type,
        payload
      });
    }
  };

  return {
    notifications,
    isConnected,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    sendNotification,
    loadNotifications
  };
}