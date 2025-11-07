import { useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createOrder(orderData: {
    customer_email: string;
    customer_name: string;
    customer_phone?: string;
    shipping_address: any;
    items: any[];
    subtotal: number;
    shipping_cost: number;
    tax: number;
    total: number;
    user_id?: string;
  }) {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-891a09ab/orders`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error creating order:', err);
      setError(String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function getUserOrders() {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not logged in, return empty
        return [];
      }

      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-891a09ab/user/orders`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      return data.orders || [];
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(String(err));
      return [];
    } finally {
      setLoading(false);
    }
  }

  return {
    createOrder,
    getUserOrders,
    loading,
    error
  };
}
