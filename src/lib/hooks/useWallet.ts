import { useQuery } from '@tanstack/react-query'
import {
  getCustomerWallets,
  getVendorWallets,
} from '@/services/wallet/wallet.service'
import { WalletResponseDTO } from '@/dtos/wallet_dto'

export const useCustomerWallet = (sortBy?: string, order?: string) => {
  return useQuery<WalletResponseDTO, Error>({
    queryKey: ['customer-wallet', sortBy, order],
    queryFn: () => getCustomerWallets(sortBy, order),
  })
}

export const useVendorWallet = () => {
  return useQuery<WalletResponseDTO, Error>({
    queryKey: ['vendor-wallet'],
    queryFn: getVendorWallets,
  })
}
