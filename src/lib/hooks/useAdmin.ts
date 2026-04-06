import {
  keepPreviousData,
  QueryKey,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import {
  adminLogout,
  changeAdminPassword,
  changeMyUserBlockStatus,
  changeVendorVerificationStatus,
  getAllCustomers,
  getAllVendors,
  getVendorRequests,
} from '@/services/admin/admin.service'
interface UsePaginatedParams {
  page: number
  limit: number
  search: string
  sortField?: string
  sortOrder?: string
  status?: string
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
  sortField,
  sortOrder,
  status,
}: {
  page: number
  limit: number
  search: string
  role: string
  sortField?: string
  sortOrder?: string
  status?: string
}) => {
  return useQuery({
    queryKey: ['admin-customers', page, limit, search, role, sortField, sortOrder, status],
    queryFn: () => getAllCustomers({ page, limit, search, role, sortField, sortOrder, status }),
  })
}

export const useGetAllVendors = ({
  page,
  limit,
  search,
  sortField,
  sortOrder,
  status,
}: UsePaginatedParams) => {
  return useQuery({
    queryKey: ['admin-vendors', page, limit, search, sortField, sortOrder, status],
    queryFn: () => getAllVendors({ page, limit, search, role: 'vendor', sortField, sortOrder, status }),
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

export const useChangeVendorVerificationStatus = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      verificationStatus,

      description,
    }: {
      userId: string
      verificationStatus: string

      description: string
    }) => {
      return await changeVendorVerificationStatus(
        userId,
        verificationStatus,
        description
      )
    },
  })
}

export const useChangeAdminPassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      changeAdminPassword(data.currentPassword, data.newPassword),
  })
}
