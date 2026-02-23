export type EditSubscriptionPlan = Partial<SubscriptionPlan>

export interface CreateSubscriptionPlan {
  name: string
  description: string

  price: number
  currency: string
  durationInDays: number

  features: {
    maxServices?: number
    videoCallAccess?: boolean
    aiChatbotAccess?: boolean
  }
  benefits: string[]
  isActive: boolean
  createdByAdminId: string

  createdAt?: Date
  updatedAt?: Date
}

export interface SubscriptionPlan {
  planId: string
  name: string
  description: string

  price: number
  currency: string
  durationInDays: number

  features: {
    maxServices?: number
    videoCallAccess?: boolean
    aiChatbotAccess?: boolean
  }
  benefits: string[]
  isActive: boolean
  createdByAdminId: string

  createdAt?: Date
  updatedAt?: Date
}

export interface ActiveSubscriptionPlans extends SubscriptionPlan {
  interval: string
}
