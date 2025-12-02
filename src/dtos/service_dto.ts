export interface RequestCreateServiceDTO {
  subServiceCategoryId: string

  title: string
  description: string

  pricing: {
    pricePerSlot: string
    isAdvanceRequired: 'true' | 'false'
    advanceAmountPerSlot: string
    currency?: string
  }

  isActiveStatusByVendor: 'true' | 'false'
  isActiveStatusByAdmin?: 'true' | 'false'
  adminStatusNote?: string

  schedule: {
    visibilityStartDate: string
    visibilityEndDate: string

    workStartTime: string
    workEndTime: string

    slotDurationMinutes: string
    recurrenceType: string

    weeklyWorkingDays?: string // "0,1,2,3"
    monthlyWorkingDates?: string // "5,12,28"
    holidayDates?: string // "2025-01-01,2025-01-10"
  }

  images: File[]
}
