import { axiosInstance } from '@/api/interceptor'
import {
  ISlot,
  RequestCreateBookingHoldDTO,
  RequestGetAvalilableSlotsDTO,
  ResponseCreateBookingHoldDTO,
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

export const createBookingHold = async (
  payload: RequestCreateBookingHoldDTO
): Promise<ResponseCreateBookingHoldDTO> => {
  const body = {
    serviceId: payload.serviceId,
    paymentMethod: 'stripe',

    slots: payload.slots.map((slot: ISlot) => ({
      date: slot.date,
      start: slot.start,
      end: slot.end,

      pricePerSlot: slot.pricing.pricePerSlot,
      advancePerSlot: slot.pricing.advancePerSlot,

      ...(slot.variant && {
        variant: {
          name: slot.variant.name,
          price: slot.variant.price,
        },
      }),
    })),
  }

  const response = await axiosInstance.post(
    CUSTOMER_ROUTES.CREATE_BOOKING_HOLD,
    body
  )

  return response.data.data
}
