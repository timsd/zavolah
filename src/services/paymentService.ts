// Payment Service for OneApp Integration

import { api } from '@/lib/api'

interface PaymentData {
  amount: number
  currency: string
  customerEmail: string
  customerName: string
  customerPhone: string
  description: string
  orderId: string
  metadata?: Record<string, any>
}

interface PaymentResponse {
  success: boolean
  paymentUrl: string
  reference: string
  transactionId: string
}

interface PaymentVerification {
  success: boolean
  status: 'success' | 'failed' | 'pending'
  reference: string
  amount: number
  currency: string
  paidAt?: string
  transactionId: string
}

class PaymentService {
  private publicKey: string

  constructor() {
    this.publicKey = import.meta.env.VITE_ONEAPP_PUBLIC_KEY || ''
  }

  // Initialize payment with OneApp
  async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      const response = await api.post<PaymentResponse>('/payments/initialize', {
        ...paymentData,
        publicKey: this.publicKey
      })
      
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to initialize payment')
    }
  }

  // Verify payment status
  async verifyPayment(reference: string): Promise<PaymentVerification> {
    try {
      const response = await api.get<PaymentVerification>(`/payments/verify/${reference}`)
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify payment')
    }
  }

  // Get payment history for a user
  async getPaymentHistory(userId: string): Promise<PaymentVerification[]> {
    try {
      const response = await api.get<{ payments: PaymentVerification[] }>(`/payments/history/${userId}`)
      return response.payments
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch payment history')
    }
  }

  // Process refund
  async processRefund(transactionId: string, amount?: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/payments/refund', {
        transactionId,
        amount
      })
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to process refund')
    }
  }

  // Handle payment redirect
  handlePaymentRedirect(paymentUrl: string) {
    window.location.href = paymentUrl
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'NGN'): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount)
  }
}

export const paymentService = new PaymentService()
export type { PaymentData, PaymentResponse, PaymentVerification }
