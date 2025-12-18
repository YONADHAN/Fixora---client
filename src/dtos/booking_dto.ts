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
