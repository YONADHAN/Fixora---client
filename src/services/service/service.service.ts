import { axiosInstance } from '@/api/interceptor'
import {
  RequestGetAllServicesDTO,
  RequestGetServiceByIdDTO,
  ResponseGetAllServicesDTO,
  ResponseGetServiceByIdDTO,
} from '@/dtos/service_dto'
import { CUSTOMER_ROUTES, VENDOR_ROUTES } from '@/utils/constants/api.routes'

export const createService = async (formData: FormData) => {
  const response = await axiosInstance.post(
    VENDOR_ROUTES.CREATE_SERVICE,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
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
