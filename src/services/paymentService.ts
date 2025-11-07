import { supabase, Order, OrderItem } from '../utils/supabase/client';
import { toast } from 'sonner';

// Razorpay Types
export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

export interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  base_amount: number;
  fees: number;
  tax: number;
  status: string;
  order_id: string;
  method: string;
  email: string;
  contact: string;
  fee: number;
  tax: number;
  error_code?: string;
  error_description?: string;
  created_at: number;
}

// Stripe Types
export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
  payment_method?: string;
  payment_method_types: string[];
  metadata: Record<string, string>;
}

// Payment Configurations
export interface PaymentConfig {
  razorpay: {
    keyId: string;
    keySecret: string;
    webhookSecret?: string;
  };
  stripe: {
    publishableKey: string;
    secretKey: string;
    webhookSecret?: string;
  };
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: 'INR' | 'USD';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: 'razorpay' | 'stripe';
}

export interface PaymentResponse {
  success: boolean;
  order?: any;
  payment?: any;
  error?: string;
  redirectUrl?: string;
}

class PaymentService {
  private razorpayKeyId: string;
  private razorpayKeySecret: string;
  private stripeKey: string;
  private baseUrl: string;

  constructor() {
    this.razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    this.razorpayKeySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET || '';
    this.stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
    this.baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    
    if (!this.razorpayKeyId) {
      console.warn('Razorpay Key ID not found. Set VITE_RAZORPAY_KEY_ID in your environment variables.');
    }
    
    if (!this.stripeKey) {
      console.warn('Stripe Key not found. Set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.');
    }
  }

  // Create Razorpay Order
  async createRazorpayOrder(paymentRequest: PaymentRequest): Promise<RazorpayOrder> {
    try {
      const orderData = {
        amount: Math.round(paymentRequest.amount * 100), // Convert to paise
        currency: paymentRequest.currency,
        receipt: `order_${paymentRequest.orderId}`,
        notes: {
          order_id: paymentRequest.orderId,
          customer_name: paymentRequest.customerInfo.name,
          customer_email: paymentRequest.customerInfo.email,
        }
      };

      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.razorpayKeyId}:${this.razorpayKeySecret}`)}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Razorpay API Error: ${errorData.error?.description || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  // Verify Razorpay Payment
  async verifyRazorpayPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      const payload = `${orderId}|${paymentId}`;
      const expectedSignature = this.generateHmacSha256(payload, this.razorpayKeySecret);
      
      return signature === expectedSignature;
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      return false;
    }
  }

  // Create Stripe Payment Intent
  async createStripePaymentIntent(paymentRequest: PaymentRequest): Promise<StripePaymentIntent> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(paymentRequest.amount * 100), // Convert to cents
          currency: paymentRequest.currency.toLowerCase(),
          metadata: {
            order_id: paymentRequest.orderId,
            customer_name: paymentRequest.customerInfo.name,
            customer_email: paymentRequest.customerInfo.email,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Stripe API Error: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error);
      throw error;
    }
  }

  // Initialize Razorpay Payment
  async initializeRazorpayPayment(paymentRequest: PaymentRequest): Promise<{ order: RazorpayOrder; razorpay: any }> {
    try {
      // Create order
      const order = await this.createRazorpayOrder(paymentRequest);
      
      // Load Razorpay script if not already loaded
      await this.loadRazorpayScript();
      
      // Initialize Razorpay instance
      const options = {
        key: this.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'KULTZR',
        description: `Order #${paymentRequest.orderId}`,
        order_id: order.id,
        prefill: {
          name: paymentRequest.customerInfo.name,
          email: paymentRequest.customerInfo.email,
          contact: paymentRequest.customerInfo.phone
        },
        notes: order.notes,
        theme: {
          color: '#A4FF00',
          background: '#0B0B0D'
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
          }
        }
      };

      // @ts-ignore
      const razorpay = new window.Razorpay(options);
      
      return { order, razorpay };
    } catch (error) {
      console.error('Error initializing Razorpay payment:', error);
      throw error;
    }
  }

  // Load Razorpay Script
  private async loadRazorpayScript(): Promise<void> {
    if (window.Razorpay) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  }

  // Generate HMAC SHA256 signature
  private generateHmacSha256(data: string, secret: string): string {
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  // Create Payment Request from Order
  createPaymentRequestFromOrder(order: Order, customerInfo: any, items: OrderItem[]): PaymentRequest {
    return {
      orderId: order.id,
      amount: order.total_amount,
      currency: order.currency as 'INR' | 'USD',
      customerInfo,
      address: {
        line1: order.shipping_address?.line1 || '',
        line2: order.shipping_address?.line2,
        city: order.shipping_address?.city || '',
        state: order.shipping_address?.state || '',
        postal_code: order.shipping_address?.postal_code || '',
        country: order.shipping_address?.country || 'IN'
      },
      items: items.map(item => ({
        id: item.product_id || '',
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price
      })),
      paymentMethod: order.currency === 'INR' ? 'razorpay' : 'stripe'
    };
  }

  // Update order payment status
  async updateOrderPaymentStatus(
    orderId: string, 
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded',
    paymentId?: string,
    paymentMethod?: string
  ): Promise<void> {
    try {
      const updateData: any = {
        payment_status: paymentStatus,
        payment_id: paymentId,
        payment_method: paymentMethod,
        updated_at: new Date().toISOString()
      };

      // If payment is successful, update order status
      if (paymentStatus === 'paid') {
        updateData.status = 'confirmed';
        updateData.order_date = new Date().toISOString();
      } else if (paymentStatus === 'failed') {
        updateData.status = 'cancelled';
        updateData.cancelled_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Log payment event
      await this.logPaymentEvent(orderId, paymentStatus, paymentId, paymentMethod);
    } catch (error) {
      console.error('Error updating order payment status:', error);
      throw error;
    }
  }

  // Log payment event for analytics
  private async logPaymentEvent(
    orderId: string, 
    status: string, 
    paymentId?: string, 
    paymentMethod?: string
  ): Promise<void> {
    try {
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'payment',
          event_data: {
            order_id: orderId,
            payment_id: paymentId,
            payment_method: paymentMethod,
            status
          },
          page_url: window.location.href,
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error logging payment event:', error);
    }
  }

  // Get payment history for user
  async getPaymentHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('user_id', userId)
        .not('payment_status', 'eq', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund(paymentId: string, amount: number, reason?: string) {
    try {
      // This would typically call Razorpay or Stripe API
      // For now, we'll simulate the refund process
      console.log('Processing refund:', { paymentId, amount, reason });
      
      toast.success('Refund request processed successfully');
      return { success: true, refundId: `refund_${Date.now()}` };
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
      throw error;
    }
  }
}

// Declare global types for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

// Export individual functions for convenience
export const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripePaymentIntent,
  initializeRazorpayPayment,
  createPaymentRequestFromOrder,
  updateOrderPaymentStatus,
  getPaymentHistory,
  processRefund
} = paymentService;