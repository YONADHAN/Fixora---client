import { axiosInstance } from '@/api/interceptor'
import {
  RequestEditServiceDTO,
  RequestGetAllServicesDTO,
  RequestGetServiceByIdDTO,
  RequestToggleBlockServiceDTO,
  ResponseEditServiceDTO,
  ResponseGetAllServicesDTO,
  ResponseGetServiceByIdDTO,
  ResponseToggleBlockServiceDTO,
} from '@/dtos/service_dto'

import { CUSTOMER_ROUTES, VENDOR_ROUTES } from '@/utils/constants/api.routes'

// export const createService = async (formData: IServiceFormValues) => {
//   const response = await axiosInstance.post(
//     VENDOR_ROUTES.CREATE_SERVICE,
//     formData,
//     {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     }
//   )

//   return response.data
// }

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
  const formData = new FormData()

  // Basic fields
  formData.append('subServiceCategoryId', payload.subServiceCategoryId)
  if (payload.title) formData.append('title', payload.title)
  if (payload.description) formData.append('description', payload.description)

  // Pricing
  if (payload.pricing) {
    if (payload.pricing.pricePerSlot !== undefined) {
      formData.append('pricing.pricePerSlot', payload.pricing.pricePerSlot)
    }
    if (payload.pricing.isAdvanceRequired !== undefined) {
      formData.append(
        'pricing.isAdvanceRequired',
        payload.pricing.isAdvanceRequired
      )
    }
    if (payload.pricing.advanceAmountPerSlot !== undefined) {
      formData.append(
        'pricing.advanceAmountPerSlot',
        payload.pricing.advanceAmountPerSlot
      )
    }
    if (payload.pricing.currency !== undefined) {
      formData.append('pricing.currency', payload.pricing.currency)
    }
  }

  // Schedule
  if (payload.schedule) {
    Object.entries(payload.schedule).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(`schedule.${key}`, value as string)
      }
    })
  }

  // Images
  if (payload.images?.length) {
    payload.images.forEach((f) => formData.append('images', f))
  }

  const response = await axiosInstance.patch(
    `${VENDOR_ROUTES.EDIT_SERVICE_BY_ID}/${serviceId}/edit`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
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
