export type VendorVerificationStatus = {
  status: 'pending' | 'accepted' | 'rejected'
  description: string
  reviewedBy?: {
    adminId: string | null
    reviewedAt?: Date
  }
  documentCount: number
}
