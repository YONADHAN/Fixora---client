import { useQuery } from '@tanstack/react-query'
import { getCustomerWallets } from '@/services/wallet/wallet.service'
import { getVendorWallets } from '@/services/wallet/wallet.service'
import { WalletResponseDTO } from '@/dtos/wallet_dto'

type WalletQueryParams = {
  page?: number
  limit?: number
  sortBy?: string
  order?: string
  search?: string
}

export const useCustomerWallet = (params: WalletQueryParams) => {
  const { page = 1, limit = 10, sortBy, order, search } = params

  return useQuery<WalletResponseDTO, Error>({
    queryKey: ['customer-wallet', page, limit, sortBy, order, search],
    queryFn: () =>
      getCustomerWallets({
        page,
        limit,
        sortBy,
        order,
        search,
      }),
    // keepPreviousData: true,
  })
}

export const useVendorWallet = (params: WalletQueryParams) => {
  const { page = 1, limit = 10, sortBy, order, search } = params

  return useQuery<WalletResponseDTO, Error>({
    queryKey: ['vendor-wallet', page, limit, sortBy, order, search],
    queryFn: () =>
      getVendorWallets({
        page,
        limit,
        sortBy,
        order,
        search,
      }),
    // keepPreviousData: true,
  })
}
