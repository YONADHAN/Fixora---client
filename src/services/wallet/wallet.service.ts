import { axiosInstance } from '@/api/interceptor'
import { WalletResponseDTO } from '@/dtos/wallet_dto'
import { ADMIN_ROUTES, CUSTOMER_ROUTES, VENDOR_ROUTES } from '@/utils/constants/api.routes'

export const getCustomerWallets = async ({
  page = 1,
  limit = 10,
  sortBy,
  order,
  search,
}: {
  page?: number
  limit?: number
  sortBy?: string
  order?: string
  search?: string
}): Promise<WalletResponseDTO> => {
  const query = new URLSearchParams()

  query.append('page', String(page))
  query.append('limit', String(limit))

  if (sortBy) query.append('sortBy', sortBy)
  if (order) query.append('order', order)
  if (search) query.append('search', search)

  const res = await axiosInstance.get(
    `${CUSTOMER_ROUTES.GET_CUSTOMER_WALLET}?${query.toString()}`,
  )

  return res.data
}

export const getVendorWallets = async ({
  page = 1,
  limit = 10,
  sortBy,
  order,
  search,
}: {
  page?: number
  limit?: number
  sortBy?: string
  order?: string
  search?: string
}): Promise<WalletResponseDTO> => {
  const query = new URLSearchParams()

  query.append('page', String(page))
  query.append('limit', String(limit))

  if (sortBy) query.append('sortBy', sortBy)
  if (order) query.append('order', order)
  if (search) query.append('search', search)

  const res = await axiosInstance.get(
    `${VENDOR_ROUTES.GET_VENDOR_WALLET}?${query.toString()}`,
  )

  return res.data
}


export const getAdminWallets = async ({
  page = 1,
  limit = 10,
  sortBy,
  order,
  search,
}: {
  page?: number
  limit?: number
  sortBy?: string
  order?: string
  search?: string
}): Promise<WalletResponseDTO> => {
  const query = new URLSearchParams()

  query.append('page', String(page))
  query.append('limit', String(limit))

  if (sortBy) query.append('sortBy', sortBy)
  if (order) query.append('order', order)
  if (search) query.append('search', search)

  const res = await axiosInstance.get(
    `${ADMIN_ROUTES.GET_ADMIN_WALLET}?${query.toString()}`,
  )

  return res.data
}