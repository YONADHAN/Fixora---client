import { axiosInstance } from '@/api/interceptor'
import { RequestCreateServiceDTO } from '@/dtos/service_dto'

import { VENDOR_ROUTES } from '@/utils/constants/api.routes'

export const createService = async (payload: RequestCreateServiceDTO) => {
  const formData = new FormData()

  formData.append('subServiceCategoryId', payload.subServiceCategoryId)
  formData.append('title', payload.title)
  formData.append('description', payload.description)

  formData.append('pricing[pricePerSlot]', payload.pricing.pricePerSlot)
  formData.append(
    'pricing[isAdvanceRequired]',
    payload.pricing.isAdvanceRequired
  )
  formData.append(
    'pricing[advanceAmountPerSlot]',
    payload.pricing.advanceAmountPerSlot
  )
  if (payload.pricing.currency)
    formData.append('pricing[currency]', payload.pricing.currency)

  formData.append('isActiveStatusByVendor', payload.isActiveStatusByVendor)
  if (payload.isActiveStatusByAdmin)
    formData.append('isActiveStatusByAdmin', payload.isActiveStatusByAdmin)
  if (payload.adminStatusNote)
    formData.append('adminStatusNote', payload.adminStatusNote)

  const schedule = payload.schedule

  formData.append('schedule[visibilityStartDate]', schedule.visibilityStartDate)
  formData.append('schedule[visibilityEndDate]', schedule.visibilityEndDate)
  formData.append('schedule[workStartTime]', schedule.workStartTime)
  formData.append('schedule[workEndTime]', schedule.workEndTime)
  formData.append('schedule[slotDurationMinutes]', schedule.slotDurationMinutes)
  formData.append('schedule[recurrenceType]', schedule.recurrenceType)

  if (schedule.weeklyWorkingDays)
    formData.append('schedule[weeklyWorkingDays]', schedule.weeklyWorkingDays)
  if (schedule.monthlyWorkingDates)
    formData.append(
      'schedule[monthlyWorkingDates]',
      schedule.monthlyWorkingDates
    )
  if (schedule.holidayDates)
    formData.append('schedule[holidayDates]', schedule.holidayDates)

  payload.images.forEach((img: File) => {
    formData.append('images', img)
  })

  const response = await axiosInstance.post(
    `${VENDOR_ROUTES.CREATE_SERVICE}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}
