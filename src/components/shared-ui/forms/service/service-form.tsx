import { IServiceFormValues } from '@/types/service_feature/service.types'

export const initialServiceFormValues: IServiceFormValues = {
  serviceId: '',
  name: '',
  description: '',
  subServiceCategoryId: '',

  serviceVariants: [],

  pricing: {
    pricePerSlot: 0,
    advanceAmountPerSlot: 0,
  },

  schedule: {
    visibilityStartDate: undefined,
    visibilityEndDate: undefined,

    dailyWorkingWindows: [{ startTime: '', endTime: '' }],

    slotDurationMinutes: 0,
    recurrenceType: undefined,
    weeklyWorkingDays: [],
    monthlyWorkingDates: [],
    overrideBlock: [],
    overrideCustom: [],
  },

  images: [],
  mainImage: undefined,
}
