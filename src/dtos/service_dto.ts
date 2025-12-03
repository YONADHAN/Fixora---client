import { recurrenceType } from '@/utils/constants/constants'

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

export interface RequestGetAllServicesDTO {
  page: string
  limit: string
  search?: string
}
export interface GetAllServicesItem {
  serviceId: string
  title: string
  description: string
  images: string[]
  isActiveStatusByVendor: boolean
}

export interface ResponseGetAllServicesDTO {
  data: GetAllServicesItem[]
  totalPages: number
  currentPage: number
}

export interface RequestGetServiceByIdDTO {
  serviceId: string
}

export interface ResponseGetServiceByIdDTO {
  vendorId: string
  subServiceCategoryId: string

  title: string
  description?: string

  pricing: {
    pricePerSlot: number
    isAdvanceRequired: boolean
    advanceAmountPerSlot: number
    currency?: string
  }

  isActiveStatusByVendor: boolean
  isActiveStatusByAdmin?: boolean
  adminStatusNote?: string

  schedule: {
    visibilityStartDate?: Date
    visibilityEndDate?: Date

    workStartTime?: string
    workEndTime?: string

    slotDurationMinutes?: number
    recurrenceType?: recurrenceType

    weeklyWorkingDays?: number[]
    monthlyWorkingDates?: number[]
    holidayDates?: Date[]
  }

  images: string[]
}

// export interface RequestEditServiceDTO {
//   title?: string
//   description?: string
//   subServiceCategoryId: string
//   pricing?: {
//     pricePerSlot?: number
//     isAdvanceRequired?: boolean
//     advanceAmountPerSlot?: number
//     currency?: string
//   }

//   isActiveStatusByVendor?: boolean
//   adminStatusNote?: string

//   schedule?: {
//     visibilityStartDate?: Date
//     visibilityEndDate?: Date

//     workStartTime?: string
//     workEndTime?: string

//     slotDurationMinutes?: number

//     recurrenceType?: recurrenceType

//     weeklyWorkingDays?: number[]
//     monthlyWorkingDates?: number[]
//     holidayDates?: Date[]
//   }

//   images?: File[]
// }
export interface RequestEditServiceDTO {
  subServiceCategoryId: string
  title?: string
  description?: string

  pricing?: {
    pricePerSlot?: string
    isAdvanceRequired?: 'true' | 'false'
    advanceAmountPerSlot?: string
    currency?: string
  }

  isActiveStatusByVendor?: 'true' | 'false'
  adminStatusNote?: string

  schedule?: {
    visibilityStartDate?: string
    visibilityEndDate?: string

    workStartTime?: string
    workEndTime?: string

    slotDurationMinutes?: string
    recurrenceType?: string

    weeklyWorkingDays?: string
    monthlyWorkingDates?: string
    holidayDates?: string
  }

  images?: File[]
}

export interface ResponseEditServiceDTO {
  serviceId: string

  title: string
  description: string

  pricing: {
    pricePerSlot: number
    isAdvanceRequired: boolean
    advanceAmountPerSlot: number
    currency: string
  }

  schedule: {
    visibilityStartDate: Date
    visibilityEndDate: Date

    workStartTime: string
    workEndTime: string

    slotDurationMinutes: number
    recurrenceType: recurrenceType

    weeklyWorkingDays: number[]
    monthlyWorkingDates: number[]
    holidayDates: Date[]
  }

  images: string[]

  isActiveStatusByVendor: boolean
  isActiveStatusByAdmin: boolean
  adminStatusNote: string

  createdAt: Date
  updatedAt: Date
}
