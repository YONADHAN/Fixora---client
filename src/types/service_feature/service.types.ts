import { recurrenceType } from '@/utils/constants/constants'

export interface IServiceFormValues {
  serviceId: string
  name: string
  description?: string
  subServiceCategoryId: string
  serviceVariants?: {
    name: string
    description?: string
    price?: number
  }[]

  pricing: {
    pricePerSlot: number
    advanceAmountPerSlot: number
  }

  schedule: {
    visibilityStartDate?: Date
    visibilityEndDate?: Date

    dailyWorkingWindows: {
      startTime: string
      endTime: string
    }[]

    slotDurationMinutes: number

    recurrenceType?: recurrenceType
    weeklyWorkingDays?: number[]
    monthlyWorkingDates?: number[]

    overrideBlock?: {
      startDateTime: Date
      endDateTime: Date
      reason?: string
    }[]

    overrideCustom?: {
      startDateTime: Date
      endDateTime: Date
      startTime?: string
      endTime?: string
    }[]
  }

  images: File[]
  mainImage?: string
}
