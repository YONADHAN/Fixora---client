import {
  RequestGetAvalilableSlotsDTO,
  RequestGetMyBookingsDTO,
  ResponseGetMyBookingsDTO,
} from '@/dtos/booking_dto'
import {
  cancelCustomerBooking,
  getAdminBookings,
  getAvailableSlotsForCustomers,
  getCustomerBookingDetails,
  getCustomerBookings,
  getVendorBookingDetails,
  getVendorBookings,
} from '@/services/booking/booking.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import {
  RequestCreateBookingHoldDTO,
  ResponseCreateBookingHoldDTO,
} from '@/dtos/booking_dto'
import { createBookingHold } from '@/services/booking/booking.service'
import { toast } from 'sonner'
export const useGetAvailableSlotsForCustomer = (
  payload: RequestGetAvalilableSlotsDTO
) => {
  return useQuery({
    queryKey: [
      'availableSlotsForCustomer',
      payload.serviceId,
      payload.year,
      payload.month,
    ],
    queryFn: () => getAvailableSlotsForCustomers(payload),

    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

export const useCreateBookingHold = () => {
  return useMutation<
    ResponseCreateBookingHoldDTO,
    Error,
    RequestCreateBookingHoldDTO
  >({
    mutationFn: (payload) => createBookingHold(payload),
  })
}

export const useCustomerBookings = (params: RequestGetMyBookingsDTO) => {
  return useQuery<ResponseGetMyBookingsDTO>({
    queryKey: ['customerBookings', params],
    queryFn: async () => {
      const res = await getCustomerBookings(params)
      return res.data.data
    },
  })
}

export const useVendorBookings = (params: RequestGetMyBookingsDTO) => {
  return useQuery<ResponseGetMyBookingsDTO>({
    queryKey: ['vendorBookings', params],
    queryFn: async () => {
      const res = await getVendorBookings(params)
      return res.data.data
    },
  })
}

export const useAdminBookings = (params: RequestGetMyBookingsDTO) => {
  return useQuery<ResponseGetMyBookingsDTO>({
    queryKey: ['adminBookings', params],
    queryFn: async () => {
      const res = await getAdminBookings(params)
      return res.data.data
    },
  })
}

export const useCustomerBookingDetails = (bookingId: string) => {
  return useQuery({
    queryKey: ['customer-booking-details', bookingId],
    queryFn: () => getCustomerBookingDetails(bookingId),
    enabled: !!bookingId,
  })
}

export const useVendorBookingDetails = (bookingId: string) => {
  return useQuery({
    queryKey: ['vendor-booking-details', bookingId],
    queryFn: () => getVendorBookingDetails(bookingId),
    enabled: !!bookingId,
  })
}

export const useCancelCustomerBooking = (bookingId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reason: string) => cancelCustomerBooking(bookingId, reason),

    onSuccess: () => {
      toast.success('Booking cancelled successfully')
      queryClient.invalidateQueries({
        queryKey: ['customer-booking-details', bookingId],
      })
    },
  })
}
