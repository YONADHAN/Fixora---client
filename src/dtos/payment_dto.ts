export interface CreatePaymentIntentResponseDTO {
  clientSecret: string
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
