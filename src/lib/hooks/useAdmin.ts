import {
  keepPreviousData,
  QueryKey,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import {
  adminLogout,
  changeMyUserBlockStatus,
  getAllCustomers,
  getAllVendors,
  getVendorRequests,
} from '@/services/admin/admin.service'
interface UsePaginatedParams {
  page: number
  limit: number
  search: string
}

import { PaginatedVendorRequests } from '@/types/users/admin/vendor_request.types'

export const useAdminLogout = () => {
  return useMutation({
    mutationFn: async () => adminLogout(),
  })
}

export const useGetAllCustomers = ({
  page,
  limit,
  search,
  role,
}: {
  page: number
  limit: number
  search: string
  role: string
}) => {
  return useQuery({
    queryKey: ['admin-customers', page, limit, search, role],
    queryFn: () => getAllCustomers({ page, limit, search, role }),
  })
}

export const useGetAllVendors = ({
  page,
  limit,
  search,
}: UsePaginatedParams) => {
  return useQuery({
    queryKey: ['admin-vendors', page, limit, search],
    queryFn: () => getAllVendors({ page, limit, search }),
  })
}

export const useChangeMyUserBlockStatus = ({
  role,
  userId,
  status,
}: {
  role: string
  userId: string
  status: string
}) => {
  return useMutation({
    mutationFn: async () => changeMyUserBlockStatus({ role, userId, status }),
  })
}

export const useVendorRequests = ({
  page,
  limit,
  search,
}: UsePaginatedParams): UseQueryResult<PaginatedVendorRequests, Error> => {
  return useQuery<
    PaginatedVendorRequests,
    Error,
    PaginatedVendorRequests,
    QueryKey
  >({
    queryKey: ['vendor-requests', page, limit, search],
    queryFn: () => getVendorRequests(page, limit, search),
    placeholderData: keepPreviousData,
  })
}
