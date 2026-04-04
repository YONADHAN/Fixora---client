export interface CreatePaymentIntentResponseDTO {
  clientSecret: string
  serviceName: string
  slots: {
    date: string
    start: string
    end: string
    advancePerSlot: number
    variant?: { name?: string; price?: number }
  }[]
  pricing: {
    totalAmount: number
    advanceAmount: number
    remainingAmount: number
  }
}

export interface GetPaymentHistoryRequestDTO {
  userId: string
  role: string
  page: number
  limit: number
  search?: string
}

export interface PaymentItemDTO {
  paymentId: string
  bookingGroupId: string
  amount: number
  status: string
  date: Date
  serviceName?: string
  customerName?: string
  vendorName?: string
}

export interface GetPaymentHistoryResponseDTO {
  data: PaymentItemDTO[]
  currentPage: number
  totalPages: number
  totalCount: number
}
