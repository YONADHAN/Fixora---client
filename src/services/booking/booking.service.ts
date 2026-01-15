import { axiosInstance } from '@/api/interceptor'
import {
  GetBookingDetailsForCustomerStrategyResponseDTO,
  GetBookingDetailsForVendorStrategyResponseDTO,
  ISlot,
  RequestCreateBookingHoldDTO,
  RequestGetAvalilableSlotsDTO,
  RequestGetMyBookingsDTO,
  ResponseCreateBookingHoldDTO,
  ResponseGetAvailableSlotsDTO,
  ResponsePayBalanceDTO,

} from '@/dtos/booking_dto'
import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  VENDOR_ROUTES,
} from '@/utils/constants/api.routes'

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
    addressId: payload.addressId,
    paymentMethod: 'stripe',
    slots: payload.slots
  }

  const response = await axiosInstance.post(
    CUSTOMER_ROUTES.CREATE_BOOKING_HOLD,
    body
  )

  return response.data.data
}

// customer
export const getCustomerBookings = (params: RequestGetMyBookingsDTO) =>
  axiosInstance.get(CUSTOMER_ROUTES.GET_CUSTOMER_BOOKINGS, { params })

// vendor
export const getVendorBookings = (params: RequestGetMyBookingsDTO) =>
  axiosInstance.get(VENDOR_ROUTES.GET_VENDOR_BOOKINGS, { params })

// admin
export const getAdminBookings = (params: RequestGetMyBookingsDTO) =>
  axiosInstance.get(ADMIN_ROUTES.GET_ADMIN_BOOKINGS, { params })

export const getVendorBookingDetails = async (
  bookingId: string
): Promise<GetBookingDetailsForVendorStrategyResponseDTO> => {
  const res = await axiosInstance.get(
    `${VENDOR_ROUTES.GET_BOOKING_DETAILS}/${bookingId}`
  )

  return res.data.data
}

export const getCustomerBookingDetails = async (
  bookingId: string
): Promise<GetBookingDetailsForCustomerStrategyResponseDTO> => {
  const response = await axiosInstance.get(
    `${CUSTOMER_ROUTES.GET_BOOKING_DETAILS}/${bookingId}`
  )
  return response.data.data
}

export const getBookingDetailsByPaymentId = async (
  paymentId: string
): Promise<GetBookingDetailsForCustomerStrategyResponseDTO> => {
  const response = await axiosInstance.get(
    `${CUSTOMER_ROUTES.GET_BOOKING_DETAILS}/payment/${paymentId}`
  )
  return response.data.data
}


export const cancelCustomerBooking = async (
  bookingId: string,
  reason: string
) => {
  return axiosInstance.patch(
    `${CUSTOMER_ROUTES.CANCEL_CUSTOMER_BOOKING}/${bookingId}/cancel`,
    { reason }
  )
}

export const payBalance = async (
  bookingId: string
): Promise<ResponsePayBalanceDTO> => {
  const response = await axiosInstance.post(
    `${CUSTOMER_ROUTES.GET_BOOKING_DETAILS}/${bookingId}/pay-balance`
  )
  return response.data
}
