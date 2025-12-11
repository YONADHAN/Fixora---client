import { statusTypes } from '@/types/user.type'
import { recurrenceType } from '@/utils/constants/constants'

// export interface RequestCreateServiceDTO {
//   subServiceCategoryId: string

//   title: string
//   description: string

//   pricing: {
//     pricePerSlot: string
//     isAdvanceRequired: 'true' | 'false'
//     advanceAmountPerSlot: string
//     currency?: string
//   }

//   isActiveStatusByVendor: 'true' | 'false'
//   isActiveStatusByAdmin?: 'true' | 'false'
//   adminStatusNote?: string

//   schedule: {
//     visibilityStartDate: string
//     visibilityEndDate: string

//     workStartTime: string
//     workEndTime: string

//     slotDurationMinutes: string
//     recurrenceType: string

//     weeklyWorkingDays?: string // "0,1,2,3"
//     monthlyWorkingDates?: string // "5,12,28"
//     holidayDates?: string // "2025-01-01,2025-01-10"
//   }

//   images: File[]
// }
export interface CreateServiceDTO {
  serviceId: string
  subServiceCategoryId: string

  name: string
  description?: string

  serviceVariants?: {
    name: string
    description?: string
    price?: number
  }[]

  pricing: {
    pricePerSlot: number
    advanceAmountPerSlot: number
  }

  images: File[]

  schedule: {
    visibilityStartDate?: string
    visibilityEndDate?: string

    dailyWorkingWindows: {
      startTime: string
      endTime: string
    }[]

    slotDurationMinutes: number

    recurrenceType?: recurrenceType
    weeklyWorkingDays?: number[]
    monthlyWorkingDates?: number[]

    overrideBlock?: {
      startDateTime: string
      endDateTime: string
      reason?: string
    }[]

    overrideCustom?: {
      startDateTime: string
      endDateTime: string
      startTime?: string
      endTime?: string
    }[]
  }
}

export interface RequestGetAllServicesDTO {
  page: string
  limit: string
  search?: string
}
export interface GetAllServicesItem {
  serviceId: string
  name: string
  description: string
  mainImage: string
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
  mainImage: string
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
  //serviceId: string
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

  images?: File[]
}

export interface ResponseEditServiceDTO {
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

  mainImage: string

  createdAt: Date
  updatedAt: Date
}

export interface RequestToggleBlockServiceDTO {
  serviceId: string
}

export interface ResponseToggleBlockServiceDTO {
  isActiveStatusByVendor: boolean
}

export interface SubServiceCategoryDTO {
  subServiceCategoryId: string
  name: string
  isActive: statusTypes
}

export interface VendorDTO {
  name: string
  userId: string
  profileImage?: string | null

  geoLocation?: {
    type?: 'Point'
    coordinates?: number[]
  }

  location?: {
    name?: string
    displayName?: string
    zipCode?: string
  }

  status?: statusTypes
}

export interface ScheduleDTO {
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

export interface RequestSearchServicesForCustomerDTO {
  subServiceCategoryId: string

  search: string

  minPrice?: number
  maxPrice?: number

  availableFrom?: Date
  availableTo?: Date

  workStartTime?: string
  workEndTime?: string

  recurrenceType?: 'daily' | 'weekly' | 'monthly'

  weeklyDays?: number[]

  page: number
  limit: number
}
export interface ResponseSearchServicesForCustomerItemDTO {
  serviceId: string

  name: string
  description: string

  serviceVariants: {
    name: string
    description: string
    price: number
  }[]

  pricing: {
    pricePerSlot: number
    advanceAmountPerSlot: number
  }

  mainImage: string

  schedule: ScheduleDTO

  vendor: VendorDTO | null

  subServiceCategory: SubServiceCategoryDTO | null
}

/* ------------------------------------------------------
   PAGINATED RESPONSE DTO
------------------------------------------------------ */
export interface ResponseSearchServicesForCustomerDTO {
  data: ResponseSearchServicesForCustomerItemDTO[]
  totalPages: number
  currentPage: number
}
