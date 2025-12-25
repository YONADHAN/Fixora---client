import { useQuery } from '@tanstack/react-query'
import {
  getCustomerWallets,
  getVendorWallets,
} from '@/services/wallet/wallet.service'
import { WalletResponseDTO } from '@/dtos/wallet_dto'

export const useCustomerWallet = () => {
  return useQuery<WalletResponseDTO, Error>({
    queryKey: ['customer-wallet'],
    queryFn: getCustomerWallets,
  })
}

export const useVendorWallet = () => {
  return useQuery<WalletResponseDTO, Error>({
    queryKey: ['vendor-wallet'],
    queryFn: getVendorWallets,
  })
}
