export interface VendorRequest {
  userId: string
  name: string
  email: string
  documents: { name: string; url: string }[]
  isVerified: { status: string; description?: string }
}

export interface PaginatedVendorRequests {
  data: VendorRequest[]
  total: number
  totalPages: number
}
