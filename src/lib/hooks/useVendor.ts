import { useMutation, useQuery } from '@tanstack/react-query'
import {
  changeVendorPassword,
  uploadVerificationDocuments,
  venderProfileInfoUpdate,
  vendorLogout,
  vendorProfileInfo,
  vendorVerificationDocStatusCheck,
} from '@/services/vendor/vendor.service'
import { VendorVerificationStatus } from '@/types/users/vendor/api_return.types'

export const useVendorLogout = () => {
  return useMutation({
    mutationFn: async () => vendorLogout(),
  })
}
export const useVendorProfileInfo = () => {
  return useQuery({
    queryKey: ['vendorProfile'],
    queryFn: async () => vendorProfileInfo(),
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  })
}

export const useVenderProfileInfoUpdate = () => {
  return useMutation({
    mutationFn: (data) => venderProfileInfoUpdate(data),
  })
}

export const useUploadVendorDocuments = () => {
  return useMutation({
    mutationFn: (files: File[]) => uploadVerificationDocuments(files),
  })
}

export const useVendorVerificationDocStatusCheck = () => {
  return useQuery<VendorVerificationStatus>({
    queryKey: ['vendorVerificationDocStatusCheck'],
    queryFn: vendorVerificationDocStatusCheck,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0,
  })
}

export const useChangeVendorPassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      changeVendorPassword(data.currentPassword, data.newPassword),
  })
}
