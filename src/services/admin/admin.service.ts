import { axiosInstance } from '@/api/interceptor'
import { ADMIN_ROUTES } from '@/utils/constants/api.routes'
import { PaginatedVendorRequests } from '@/types/users/admin/vendor_request.types'

export const adminLogout = async () => {
  const response = await axiosInstance.post(`${ADMIN_ROUTES.LOGOUT}`)
  return response
}

export const getAllCustomers = async ({
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
  const response = await axiosInstance.post(
    `${ADMIN_ROUTES.GET_ALL_CUSTOMERS}`,
    { page, limit, search, role }
  )
  return response
}

export const getAllVendors = async ({
  page,
  limit,
  search,
}: {
  page: number
  limit: number
  search: string
}) => {
  const response = await axiosInstance.post(`${ADMIN_ROUTES.GET_ALL_VENDORS}`, {
    page,
    limit,
    search,
  })
  return response
}

export const changeMyUserBlockStatus = async ({
  role,
  userId,
  status,
}: {
  role: string
  userId: string
  status: string
}) => {
  const response = await axiosInstance.post(
    `${ADMIN_ROUTES.CHANGE_MY_USER_BLOCK_STATUS}`,
    { role, userId, status }
  )
  return response
}

export const getVendorRequests = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<PaginatedVendorRequests> => {
  const response = await axiosInstance.get(ADMIN_ROUTES.GET_VENDOR_REQUESTS, {
    params: { page, limit, search },
  })
  return response.data.data as PaginatedVendorRequests
}

export const changeVendorVerificationStatus = async (
  userId: string,
  verificationStatus: string,

  description: string
): Promise<void> => {
  const response = await axiosInstance.post(
    ADMIN_ROUTES.CHANGE_VENDOR_VERIFICATION_BLOCK_STATUS,
    {
      userId,

      verificationStatus,
      description,
    }
  )

  return response.data
}

export const changeAdminPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const response = await axiosInstance.post(ADMIN_ROUTES.CHANGE_PASSWORD, {
    currentPassword,
    newPassword,
  })
  return response
}
