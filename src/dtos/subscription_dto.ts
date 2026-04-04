

export interface SubscriptionPlanDetails {
  planId: string
  name: string
  description: string
  price: number
  durationInDays: number
  features: {
    maxServices?: number
    videoCallAccess?: boolean
    aiChatbotAccess?: boolean
  }
  benefits: string[]
}

export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'cancelled'
export type PaymentStatus = 'initiated' | 'success' | 'failed'

export interface VendorSubscriptionItem {
  subscriptionId: string
  userId: string
  userRole: string
  status: SubscriptionStatus
  startDate?: string
  endDate?: string
  autoRenew: boolean
  paymentStatus: PaymentStatus
  plan: SubscriptionPlanDetails
}

export interface GetMySubscriptionsResponseDTO {
  message: string
  data: {
    subscriptions: VendorSubscriptionItem[]
  }
}

export interface CancelSubscriptionResponseDTO {
  message: string
  data: {
    subscriptionId: string
    status: string
  }
}
