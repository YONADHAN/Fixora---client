import { axiosInstance } from '@/api/interceptor'
import { WalletResponseDTO } from '@/dtos/wallet_dto'
import { CUSTOMER_ROUTES, VENDOR_ROUTES } from '@/utils/constants/api.routes'

export const getCustomerWallets = async (
  sortBy?: string,
  order?: string
): Promise<WalletResponseDTO> => {
  const query = new URLSearchParams()
  if (sortBy) query.append('sortBy', sortBy)
  if (order) query.append('order', order)

  const res = await axiosInstance.get(
    `${CUSTOMER_ROUTES.GET_CUSTOMER_WALLET}?${query.toString()}`
  )
  return res.data.data
}

export const getVendorWallets = async (): Promise<WalletResponseDTO> => {
  const res = await axiosInstance.get(`${VENDOR_ROUTES.GET_VENDOR_WALLET}`)
  return res.data.data
}
