import { useMutation } from '@tanstack/react-query'
import { customerUploadProfileImage } from '@/services/customer/customer.service'
import { vendorUploadProfileImage } from '@/services/vendor/vendor.service'

export const useProfileImageUploader = (role: 'customer' | 'vendor') => {
  return useMutation({
    mutationFn: (file: File) => {
      if (role === 'customer') {
        return customerUploadProfileImage(file)
      }
      return vendorUploadProfileImage(file)
    },
  })
}
