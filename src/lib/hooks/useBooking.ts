import { RequestGetAvalilableSlotsDTO } from '@/dtos/booking_dto'
import { getAvailableSlotsForCustomers } from '@/services/booking/booking.service'
import { useQuery } from '@tanstack/react-query'

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
