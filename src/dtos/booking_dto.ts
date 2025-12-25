import { TRole } from '@/types/user.type'

export interface RequestGetAvalilableSlotsDTO {
  serviceId: string
  month: string
  year: string
}

export interface ResponseGetAvailableSlotsDTO {
  [date: string]: {
    start: string
    end: string
  }[]
}

export interface ISlot {
  date: string
  start: string
  end: string
  pricing: {
    pricePerSlot: number
    advancePerSlot: number
  }
  variant?: {
    name?: string
    price?: number
  }
}

export interface RequestCreateBookingHoldDTO {
  serviceId: string
  paymentMethod?: 'stripe'
  slots: ISlot[]
}

export interface ResponseCreateBookingHoldDTO {
  holdId: string
  pricing: {
    totalAmount: number
    advanceAmount: number
    remainingAmount: number
  }
  expiresAt: Date
}

export interface RequestGetMyBookingsDTO {
  page: number
  limit: number
  search: string
}

export interface ResponseGetMyBookingsDTO {
  data: {
    bookingId: string
    bookingGroupId: string
    paymentStatus: string
    serviceStatus: string
    cancelInfo?: {
      cancelledByRole?: TRole
      reason?: string
    }
  }[]
  totalPages: number
  currentPage: number
}

export interface GetBookingDetailsForCustomerStrategyResponseDTO {
  booking: {
    bookingId: string
    bookingGroupId: string
    date: string
    slotStart?: string
    slotEnd?: string
    paymentStatus: string
    serviceStatus: string
  }

  service: {
    serviceId: string
    name: string
    pricing: {
      pricePerSlot: number
      advanceAmountPerSlot: number
    }
    variants?: {
      name: string
      description?: string
      price?: number
    }[]
  }

  vendor: {
    name: string
    profileImage?: string
    location?: {
      name?: string
      displayName?: string
    }
  }
}

export interface GetBookingDetailsForVendorStrategyResponseDTO {
  booking: {
    bookingId: string
    bookingGroupId: string
    date: string
    slotStart?: string
    slotEnd?: string
    paymentStatus: string
    serviceStatus: string
    cancelInfo?: {
      cancelledByRole?: string
      reason?: string
      cancelledAt?: string
    }
  }

  service: {
    serviceId: string
    name: string
    pricing: {
      pricePerSlot: number
      advanceAmountPerSlot: number
    }
    variants?: {
      name: string
      description?: string
      price?: number
    }[]
  }

  customer: {
    name: string
    email: string
    phone?: string
    profileImage?: string
    location?: {
      name?: string
      displayName?: string
      zipCode?: string
    }
  }
}
