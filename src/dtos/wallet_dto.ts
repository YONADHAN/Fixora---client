export type Wallet = {
  walletId: string
  balance: number
  currency: string
}

export type WalletTransaction = {
  transactionId: string
  type: 'credit' | 'debit'
  source:
    | 'service-booking'
    | 'booking-refund'
    | 'wallet-topup'
    | 'admin-adjustment'
    | 'service-payout'
  amount: number
  currency: string
  description?: string
  createdAt: string
}

export type WalletResponseDTO = {
  wallet: Wallet | null
  transactions: WalletTransaction[]
}
