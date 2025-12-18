import { RequestGetAvalilableSlotsDTO } from '@/dtos/booking_dto'
import { getAvailableSlotsForCustomers } from '@/services/booking/booking.service'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import {
  RequestCreateBookingHoldDTO,
  ResponseCreateBookingHoldDTO,
} from '@/dtos/booking_dto'
import { createBookingHold } from '@/services/booking/booking.service'
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
