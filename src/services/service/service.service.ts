import { axiosInstance } from '@/api/interceptor'
import {
  RequestEditServiceDTO,
  RequestGetAllServicesDTO,
  RequestGetServiceByIdDTO,
  RequestSearchServicesForCustomerDTO,
  RequestToggleBlockServiceDTO,
  ResponseEditServiceDTO,
  ResponseGetAllServicesDTO,
  ResponseGetServiceByIdDTO,
  ResponseSearchServicesForCustomerDTO,
  ResponseToggleBlockServiceDTO,
} from '@/dtos/service_dto'

import { CUSTOMER_ROUTES, VENDOR_ROUTES } from '@/utils/constants/api.routes'

export const createService = async (formData: FormData) => {
  const response = await axiosInstance.post(
    VENDOR_ROUTES.CREATE_SERVICE,
    formData
  )

  return response.data
}

export const getAllServices = async (
  payload: RequestGetAllServicesDTO
): Promise<ResponseGetAllServicesDTO> => {
  const response = await axiosInstance.get(VENDOR_ROUTES.GET_ALL_SERVICES, {
    params: {
      page: payload.page,
      limit: payload.limit,
      search: payload.search,
    },
  })
  return response.data.data
}

export const getServiceById = async (
  payload: RequestGetServiceByIdDTO
): Promise<ResponseGetServiceByIdDTO> => {
  const response = await axiosInstance.get(
    `${CUSTOMER_ROUTES.GET_SERVICES_BY_ID}/${payload.serviceId}`
  )
  return response.data.data
}

export const editServiceById = async (
  serviceId: string,
  payload: RequestEditServiceDTO
): Promise<ResponseEditServiceDTO> => {
  console.log('Entering service edit by id api')
  const formData = new FormData()

  //formData.append('serviceId', payload.serviceId)
  formData.append('name', payload.name)
  formData.append('subServiceCategoryId', payload.subServiceCategoryId)

  if (payload.description) {
    formData.append('description', payload.description)
  }

  if (payload.serviceVariants?.length) {
    payload.serviceVariants.forEach((variant, index) => {
      formData.append(`serviceVariants[${index}].name`, variant.name)

      if (variant.description) {
        formData.append(
          `serviceVariants[${index}].description`,
          variant.description
        )
      }

      if (variant.price !== undefined) {
        formData.append(
          `serviceVariants[${index}].price`,
          String(variant.price)
        )
      }
    })
  }

  formData.append('pricing.pricePerSlot', String(payload.pricing.pricePerSlot))

  formData.append(
    'pricing.advanceAmountPerSlot',
    String(payload.pricing.advanceAmountPerSlot)
  )

  if (payload.schedule.visibilityStartDate) {
    formData.append(
      'schedule.visibilityStartDate',
      new Date(payload.schedule.visibilityStartDate).toISOString()
    )
  }

  if (payload.schedule.visibilityEndDate) {
    formData.append(
      'schedule.visibilityEndDate',
      new Date(payload.schedule.visibilityEndDate).toISOString()
    )
  }

  payload.schedule.dailyWorkingWindows?.forEach((window, index) => {
    formData.append(
      `schedule.dailyWorkingWindows[${index}].startTime`,
      window.startTime
    )
    formData.append(
      `schedule.dailyWorkingWindows[${index}].endTime`,
      window.endTime
    )
  })

  formData.append(
    'schedule.slotDurationMinutes',
    String(payload.schedule.slotDurationMinutes)
  )

  if (payload.schedule.recurrenceType) {
    formData.append('schedule.recurrenceType', payload.schedule.recurrenceType)
  }

  if (payload.schedule.weeklyWorkingDays?.length) {
    payload.schedule.weeklyWorkingDays.forEach((day, index) => {
      formData.append(`schedule.weeklyWorkingDays[${index}]`, String(day))
    })
  }

  if (payload.schedule.monthlyWorkingDates?.length) {
    payload.schedule.monthlyWorkingDates.forEach((date, index) => {
      formData.append(`schedule.monthlyWorkingDates[${index}]`, String(date))
    })
  }

  // ✅ OVERRIDE BLOCK
  if (payload.schedule.overrideBlock?.length) {
    payload.schedule.overrideBlock.forEach((block, index) => {
      formData.append(
        `schedule.overrideBlock[${index}].startDateTime`,
        block.startDateTime.toISOString()
      )

      formData.append(
        `schedule.overrideBlock[${index}].endDateTime`,
        block.endDateTime.toISOString()
      )

      if (block.reason) {
        formData.append(`schedule.overrideBlock[${index}].reason`, block.reason)
      }
    })
  }

  //  OVERRIDE CUSTOM
  if (payload.schedule.overrideCustom?.length) {
    payload.schedule.overrideCustom.forEach((custom, index) => {
      formData.append(
        `schedule.overrideCustom[${index}].startDateTime`,
        custom.startDateTime.toISOString()
      )

      formData.append(
        `schedule.overrideCustom[${index}].endDateTime`,
        custom.endDateTime.toISOString()
      )

      if (custom.startTime) {
        formData.append(
          `schedule.overrideCustom[${index}].startTime`,
          custom.startTime
        )
      }

      if (custom.endTime) {
        formData.append(
          `schedule.overrideCustom[${index}].endTime`,
          custom.endTime
        )
      }
    })
  }

  if (payload.images?.length) {
    payload.images.forEach((file) => {
      formData.append('images', file)
    })
  }
  console.log(
    '🚀 SENDING REQUEST TO:',
    `${VENDOR_ROUTES.EDIT_SERVICE_BY_ID}/${serviceId}/edit`
  )

  const response = await axiosInstance.patch(
    `${VENDOR_ROUTES.EDIT_SERVICE_BY_ID}/${serviceId}/edit`,
    formData
  )

  return response.data.data
}

export const toggleServiceById = async (
  payload: RequestToggleBlockServiceDTO
): Promise<ResponseToggleBlockServiceDTO> => {
  const { serviceId } = payload

  const response = await axiosInstance.patch(
    `${VENDOR_ROUTES.TOGGLE_SERVICE_BY_ID}/${serviceId}/toggleblock`
  )

  return response.data.data
}

export const searchServicesForCustomer = async (
  payload: RequestSearchServicesForCustomerDTO
): Promise<ResponseSearchServicesForCustomerDTO> => {
  const response = await axiosInstance.get(
    `${CUSTOMER_ROUTES.SEARCH_SERVICES_FOR_CUSTOMERS}`,
    {
      params: {
        subServiceCategoryId: payload.subServiceCategoryId,
        page: payload.page.toString(),
        limit: payload.limit.toString(),
        search: payload.search,
        minPrice: payload.minPrice?.toString(),
        maxPrice: payload.maxPrice?.toString(),
        availableFrom: payload.availableFrom?.toString(),
        availableTo: payload.availableTo?.toString(),
        workStartTime: payload.workStartTime?.toString(),
        workEndTime: payload.workEndTime?.toString(),
        recurrenceType: payload.recurrenceType,
        weeklyDays: payload.weeklyDays?.toString(),
      },
    }
  )
  return response.data.data
}
