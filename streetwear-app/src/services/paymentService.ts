import { supabase } from '../utils/supabase'

export interface PaymentMethod {
  type: 'razorpay' | 'stripe' | 'cod'
  details?: any
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  client_secret?: string
  order_id?: string
}

export interface PaymentResult {
  success: boolean
  payment_id?: string
  order_id?: string
  error?: string
  transaction_details?: any
}

// Razorpay Integration
export class RazorpayService {
  private static instance: RazorpayService
  private isInitialized = false

  private constructor() {}

  static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService()
    }
    return RazorpayService.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => {
      this.isInitialized = true
    }
    script.onerror = () => {
      throw new Error('Failed to load Razorpay SDK')
    }
    document.head.appendChild(script)

    // Wait for script to load
    await new Promise((resolve, reject) => {
      script.onload = resolve
      script.onerror = reject
      setTimeout(() => reject(new Error('Timeout loading Razorpay')), 10000)
    })
  }

  async createOrder(amount: number, currency: string = 'INR'): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: amount * 100, // Convert to paise
          currency,
          receipt: `order_${Date.now()}`
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating Razorpay order:', error)
      throw error
    }
  }

  async processPayment(orderData: any): Promise<PaymentResult> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'KULTZR',
        description: 'Streetwear Purchase',
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResult = await this.verifyPayment(response)
            resolve(verifyResult)
          } catch (error) {
            reject(error)
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          address: 'KULTZR Streetwear'
        },
        theme: {
          color: '#A4FF00'
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    })
  }

  async verifyPayment(paymentData: any): Promise<PaymentResult> {
    try {
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature
        }
      })

      if (error) throw error

      return {
        success: true,
        payment_id: paymentData.razorpay_payment_id,
        transaction_details: data
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      return {
        success: false,
        error: 'Payment verification failed'
      }
    }
  }
}

// Stripe Integration
export class StripeService {
  private static instance: StripeService
  private stripe: any = null

  private constructor() {}

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService()
    }
    return StripeService.instance
  }

  async initialize(): Promise<void> {
    if (this.stripe) return

    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!stripeKey) {
      throw new Error('Stripe publishable key not found')
    }

    // @ts-ignore
    this.stripe = await import('@stripe/stripe-js').then(({ loadStripe }) => 
      loadStripe(stripeKey)
    )
  }

  async createPaymentIntent(amount: number, currency: string = 'inr'): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-payment', {
        body: {
          amount: amount * 100, // Convert to cents
          currency,
          automatic_payment_methods: {
            enabled: true
          }
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error)
      throw error
    }
  }

  async processPayment(paymentIntent: any): Promise<PaymentResult> {
    await this.initialize()

    try {
      const { error, paymentIntent: confirmedPayment } = await this.stripe.confirmPayment({
        clientSecret: paymentIntent.client_secret,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`
        }
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        payment_id: confirmedPayment.id,
        transaction_details: confirmedPayment
      }
    } catch (error) {
      console.error('Error processing Stripe payment:', error)
      return {
        success: false,
        error: 'Payment processing failed'
      }
    }
  }
}

// Cash on Delivery
export class CODService {
  async processPayment(orderData: any): Promise<PaymentResult> {
    // COD doesn't require immediate payment processing
    // Just create the order and mark as pending payment
    return {
      success: true,
      order_id: orderData.id,
      transaction_details: { payment_method: 'COD' }
    }
  }
}

// Unified Payment Service
export class PaymentService {
  private razorpay = RazorpayService.getInstance()
  private stripe = StripeService.getInstance()
  private cod = new CODService()

  async processPayment(
    amount: number,
    method: PaymentMethod,
    orderData?: any
  ): Promise<PaymentResult> {
    try {
      switch (method.type) {
        case 'razorpay':
          const razorpayOrder = await this.razorpay.createOrder(amount)
          const razorpayResult = await this.razorpay.processPayment(razorpayOrder)
          if (razorpayResult.success) {
            await this.updateOrderPayment(razorpayResult.payment_id!, 'completed', method)
          }
          return razorpayResult

        case 'stripe':
          const stripeIntent = await this.stripe.createPaymentIntent(amount)
          const stripeResult = await this.stripe.processPayment(stripeIntent)
          if (stripeResult.success) {
            await this.updateOrderPayment(stripeResult.payment_id!, 'completed', method)
          }
          return stripeResult

        case 'cod':
          const codResult = await this.cod.processPayment(orderData)
          await this.updateOrderPayment(orderData.id, 'pending', method)
          return codResult

        default:
          throw new Error('Unsupported payment method')
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      }
    }
  }

  private async updateOrderPayment(
    paymentId: string,
    status: string,
    method: PaymentMethod
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_id: paymentId,
          payment_status: status,
          payment_method: method.type,
          payment_details: method.details || null
        })
        .eq('id', paymentId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating order payment:', error)
    }
  }

  async refundPayment(paymentId: string, amount: number, reason: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('process-refund', {
        body: {
          payment_id: paymentId,
          amount,
          reason
        }
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error processing refund:', error)
      return false
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('get-payment-status', {
        body: { payment_id: paymentId }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting payment status:', error)
      return null
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService()