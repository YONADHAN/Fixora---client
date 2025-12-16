import { axiosInstance } from '@/api/interceptor'
import {
  RequestGetAvalilableSlotsDTO,
  ResponseGetAvailableSlotsDTO,
} from '@/dtos/booking_dto'
import { CUSTOMER_ROUTES } from '@/utils/constants/api.routes'

export const getAvailableSlotsForCustomers = async (
  payload: RequestGetAvalilableSlotsDTO
): Promise<ResponseGetAvailableSlotsDTO> => {
  const response = await axiosInstance.get(
    CUSTOMER_ROUTES.GET_AVAILABLE_SLOTS_FOR_CUSTOMERS,
    {
      params: {
        serviceId: payload.serviceId,
        month: payload.month,
        year: payload.year,
      },
    }
  )
  return response.data.data
}
