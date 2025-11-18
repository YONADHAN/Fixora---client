import { axiosInstance } from '@/api/interceptor'

import { CUSTOMER_ROUTES } from '@/utils/constants/api.routes'

export const customerLogout = async () => {
  const response = await axiosInstance.post(`${CUSTOMER_ROUTES.LOGOUT}`)
  return response
}

export const customerProfileInfo = async () => {
  const response = await axiosInstance.get(
    `${CUSTOMER_ROUTES.GET_PROFILE_INFO}`
  )
  return response
}

export const customerProfileInfoUpdate = async (data: any) => {
  const response = await axiosInstance.patch(
    CUSTOMER_ROUTES.UPDATE_PROFILE_INFO,
    data
  )
  return response.data
}

export const changeCustomerPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const response = await axiosInstance.post(CUSTOMER_ROUTES.CHANGE_PASSWORD, {
    currentPassword,
    newPassword,
  })
  return response
}

export const customerUploadProfileImage = async (file: File) => {
  const formData = new FormData()
  formData.append('profileImage', file)

  const response = await axiosInstance.post(
    CUSTOMER_ROUTES.UPLOAD_PROFILE_IMAGE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}
